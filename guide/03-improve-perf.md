# Step 3. パフォーマンスの改善

Step 2 の実装はメインスレッド上で toxicity の計算をするため UI をブロッキングしてしまう。
`ToxicityService` で行っていた高負荷な計算処理を [Web Worker](https://developer.mozilla.org/ja/docs/Web/API/Web_Workers_API/Using_web_workers) へ移譲し、メインスレッドの負荷を軽減してみよう。

## 1. Comlink の導入

Web Worker を簡単に扱うことができるラッパーライブラリとして [Comlink](https://github.com/GoogleChromeLabs/comlink) を導入する。

参考: [Angular: Comlink を使った Web Worker の導入 \| lacolaco/tech](https://blog.lacolaco.net/2021/05/enjoyable-webworkers-in-angular.ja/)

```shell
yarn add comlink
```

## 2. Web Worker モジュールの生成

`ng generate webworker` コマンドを使って Web Worker モジュールとして使用する TypeScript ファイルを生成する。また、同時に Angular CLI が `tsconfig.worker.json` を生成するため、Web Worker 用の TypeScript 設定も完了する。

```
ng g webworker toxicity
```

これで `toxicity.worker.ts` ファイルが生成される。

## 3. ワーカーの実装

toxicity の計算処理を `toxicity.worker.ts` に移動する。 `api` オブジェクトに `classify` メソッドを定義し、`expose(api)` で Comlink を通して外部に API を公開する。

また、学習済みモデルを `model` 変数に保持するようにして複数回ロードし直さないようにしている。

```ts
/// <reference lib="webworker" />

import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
import { expose } from "comlink";
import { ToxicityPrediction } from "./toxicity";

const threshold = 0.9;

let model: toxicity.ToxicityClassifier | null = null;

async function loadModel() {
  return model ?? toxicity.load(threshold, []).then((m) => (model = m));
}

export const api = {
  async classify(input: string): Promise<ToxicityPrediction[]> {
    return loadModel()
      .then((model) => model.classify(input))
      .then((result) =>
        result.map((prediction) => ({
          label: prediction.label,
          match: prediction.results.some((r) => r.match),
        }))
      );
  },
};

expose(api);
```

`ToxicityPrediction` 型は複数のファイルから呼び出されるため独立した `toxicity.ts`で宣言するように移動する。

```ts
export type ToxicityPrediction = {
  label: string;
  match: boolean;
};
```

## 4. `ToxicityService` からワーカーを起動する

`toxicity.worker.ts` を Web Worker として読み込んだ上で、Comlink を通して公開された API を利用する。
`wrap<typeof import("./toxicity.worker").api>` のように型情報を注釈することで Web Worker 越しの API でも TypeScript の型チェックを適用できる。

```ts
import { Injectable } from "@angular/core";
import { wrap } from "comlink";
import { ToxicityPrediction } from "./toxicity";

const worker = wrap<typeof import("./toxicity.worker").api>(
  new Worker(new URL("./toxicity.worker", import.meta.url))
);

@Injectable({
  providedIn: "root",
})
export class ToxicityService {
  classify(input: string): Promise<ToxicityPrediction[]> {
    return worker.classify(input);
  }
}
```
