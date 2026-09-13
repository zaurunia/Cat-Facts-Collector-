# 🐾 Tuxedo Cat Fact Logger (.NET 8 / C#)

> **Projekt**: Cat Fact API + Statistics  
> **Branding**: Tuxedo Cat Fact Logger  
> **Technologie**: Microsoft C#, .NET 8, HttpClient, System.Text.Json, Microsoft.Extensions.DependencyInjection, Git

---

## 📁 Struktura Repozytorium

```text
TuxedoCatFactLogger
├── TuxedoCatFactLogger.csproj
├── Program.cs
├── Models/
│   └── CatFact.cs
├── Services/
│   ├── ICatFactService.cs
│   └── CatFactService.cs
├── Clients/
│   ├── ICatFactClient.cs
│   └── CatFactClient.cs
└── Data/
    └── cat-facts.txt
```

---

## ⚙️ Wymagania techniczne & Realizacja

1. **Technologia Microsoftu**:
   - Język: **C# 12**
   - Platforma: **.NET 8**
   - Serializacja JSON: `System.Text.Json`
   - Klient HTTP: `System.Net.Http.HttpClient` z `IHttpClientFactory`
   - Kontener IoC: `Microsoft.Extensions.DependencyInjection`

2. **Połączenie z endpointem API**:
   - Endpoint: `https://catfact.ninja/fact`
   - Asynchroniczne wywołanie `GetFromJsonAsync<CatFact>()` z obsługą `CancellationToken`.

3. **Zapis do lokalnego pliku `.txt`**:
   - Ścieżka: `Data/cat-facts.txt`
   - Format zapisu (Wariant 3):
     ```text
     2026-09-10 | Cats sleep for around 12-16 hours a day. | 42
     2026-09-10 | Cats have five toes on their front paws. | 41
     ```
   - Każde wywołanie dopisuje dokładnie jeden wiersz w nowej linijce (`\n`).

4. **Statystyki w konsoli**:
   - Liczba wykonanych requestów (`Requests made`)
   - Liczba zapisanych faktów (`Facts saved`)
   - Średnia długość faktu w znakach (`Average fact length`)
   - Ostatnio pobrany fakt (`Latest fact`)

---

## 🚀 Jak uruchomić?

```bash
# 1. Wejdź do katalogu projektu
cd TuxedoCatFactLogger

# 2. Przywróć pakiety NuGet i uruchom (1 fakt)
dotnet run

# 3. Pobierz serię faktów (np. 5)
dotnet run -- --count=5
```
