# Vane Presets Repository

Topluluk odaklı Vane DPI bypass kural havuzu.

## Nasıl Preset Eklerim? (Pull Request)

1. Bu repoyu fork'layın.
2. `community` klasörü içerisine yeni bir JSON dosyası oluşturun (Örn: `turknet-hizli.json`).
3. Aşağıdaki formatta kurallarınızı girin:
```json
{
  "id": "benzersiz-bir-id",
  "name": "Kural Adı",
  "description": "Kısa açıklama",
  "args": [
    "--arg1",
    "--arg2"
  ]
}
```
4. Pull Request (PR) gönderin.

Onaylandığında otomatik olarak ana listeye eklenecektir.
