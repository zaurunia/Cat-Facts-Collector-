# Cat Fact Collector (.NET 8 / C# Console Solution)

Implementacja zadania rekrutacyjnego w technologii Microsoft C# / .NET z wykorzystaniem:
- `Microsoft.Extensions.DependencyInjection`
- `Microsoft.Extensions.Hosting`
- `Microsoft.Extensions.Http` (IHttpClientFactory)
- Typowany model JSON `CatFactResponse`
- `File.AppendAllLinesAsync` do dopisywania faktów w nowych linijkach do pliku `.txt`

## Wymagania:
- .NET 8.0 SDK lub nowszy

## Uruchomienie:
```bash
cd dotnet-solution
dotnet restore
dotnet run
```

Plik `cat_facts.txt` zostanie utworzony i zaktualizowany w folderze aplikacji.
