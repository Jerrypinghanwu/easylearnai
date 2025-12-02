# 跨瀏覽器兼容性報告

## 測試瀏覽器
- Chrome 130（Android、Windows）
- Safari 17（iOS、macOS）
- Edge 130（Windows）
- Firefox 131（Windows、Android）

## 結論
- 版面、導覽、滾動與互動在上述瀏覽器皆能正常使用。
- 動畫對於 `prefers-reduced-motion` 使用者自動停用。

## 觀察重點
- Sticky 導覽列在 Safari/iOS 正常；Backdrop blur 在舊版 iOS 可能退化為純色背景。
- CSS `color-mix` 在部分舊版瀏覽器退化為純色顯示，不影響可用性。
- 平滑滾動使用原生 `scrollIntoView`，舊版瀏覽器退化為瞬移。

## 建議
- 若需支援更舊版本，可移除 `color-mix` 或提供漸進增強。

