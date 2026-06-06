# 棒読みイントロドン

有名な歌詞を感情ゼロで読み上げます。何の曲か当ててみよう！

## 開発の流れ

### 1. ローカルで確認

```bash
cd ~/Desktop/lyrics-quiz
npm run dev
```

ブラウザで http://localhost:3000 を開く

### 2. GitHubにプッシュ

```bash
git add .
git commit -m "修正内容"
git push
```

### 3. 本番反映

GitHubにプッシュすると Vercel が自動でデプロイする（数分）

---

## 曲の追加・修正

[data/songs.ts](data/songs.ts) を編集する

## 技術スタック

- Next.js 16
- TypeScript
- Tailwind CSS
- Vercel（ホスティング）
