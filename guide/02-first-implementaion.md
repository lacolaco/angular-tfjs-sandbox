# Step 2. 素朴な実装

## 1. UI の実装

Angular Forms (テンプレート駆動フォーム) にバインディングされた `input` 要素をひとつ表示するように `AppComponent` を変更します。

```html
<!-- app.component.html -->
<input class="p-2 border-2 rounded" [(ngModel)]="text" />

<p>{{ text }}</p>
```

```ts
// app.component.ts
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  host: {
    class: "flex p-4 space-x-2 items-center",
  },
})
export class AppComponent {
  text = "Hello Angular!";
}
```

`FormsModule` を `AppModule` に追加するのも忘れずに行います。

## 2. `toxicity` パイプの生成

与えられた文章の _toxicity_ (毒性) を計算して表示する `toxicity` パイプを `ng generate` コマンドを使って生成します。

```shell
ng g pipe toxicity
```

```ts
// toxicity.pipe.ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "toxicity",
})
export class ToxicityPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}
```

生成したパイプを `AppComponent`のテンプレート HTML で呼び出します。

```html
<p>{{ text | toxicity }}</p>
```

## 3. TensorFlow.js を使った toxicity の計算

[TensorFlow.js](https://www.tensorflow.org/js?hl=ja) の学習済みモデルを使い、与えられたテキストの toxicity を計算するよう `ToxicityPipe` を実装します。

### 必要なパッケージのインストール

```shell
yarn add @tensorflow/tfjs @tensorflow-models/toxicity
```

### Toxicity を計算するサービスクラスの追加

```shell
ng g service toxicity
```

### `ToxicityService` で tfjs を使用する

```ts
import { Injectable } from "@angular/core";
import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";

const threshold = 0.9;

export type ToxicityPrediction = {
  label: string;
  match: boolean;
};

@Injectable({
  providedIn: "root",
})
export class ToxicityService {
  // テキストの毒性を分類する
  classify(input: string): Promise<ToxicityPrediction[]> {
    return (
      toxicity
        // 学習済みモデルの読み込み
        .load(threshold, [])
        // 計算
        .then((model) => model.classify(input))
        // 計算結果の整形
        .then((result) =>
          result.map((prediction) => ({
            label: prediction.label,
            match: prediction.results.some((r) => r.match),
          }))
        )
    );
  }
}
```

### `ToxicityPipe` から `ToxicityService` を呼び出す

```ts
import { Pipe, PipeTransform } from "@angular/core";
import { ToxicityService, ToxicityPrediction } from "./toxicity.service";

@Pipe({
  name: "toxicity",
})
export class ToxicityPipe implements PipeTransform {
  constructor(private readonly toxicityService: ToxicityService) {}

  transform(value: string): Promise<ToxicityPrediction[]> {
    return this.toxicityService.classify(value);
  }
}
```
