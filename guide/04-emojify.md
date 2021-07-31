# Step 4. Toxicity の絵文字化

最期にテキストから計算された toxicity のレベルを絵文字で表現できるようにする。

## 1. `emojify` パイプの生成

```
ng g pipe emojify
```

## 2. 計算結果から絵文字への変換

`toxicity` パイプの変換結果は `ToxicityPrediction` の配列になる。配列の中身はいろいろな毒性の種類ごとにマッチするかどうかのフラグと尤度（確率）である。
今回は単純にマッチする毒性の数に応じて絵文字を変える。

```ts
import { Pipe, PipeTransform } from "@angular/core";
import { ToxicityPrediction } from "./toxicity";

const emojis = ["😊", "😒", "🤐", "😦", "😡", "🤬", "⛔️"];

@Pipe({
  name: "emojify",
})
export class EmojifyPipe implements PipeTransform {
  transform(value: ToxicityPrediction[] | null): string {
    if (value == null) {
      return "🤔";
    }

    const level = value.filter((p) => p.match).length;
    return emojis[Math.min(level, 6)];
  }
}
```

## 3. `emojify` パイプを使って表示する

`AppComponent` のテンプレートで `emojify` パイプを使用する。

```html
<p>{{ text | toxicity | async | emojify }}</p>
```
