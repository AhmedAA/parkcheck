Parkcheck is an app to help check if you have parked legally in European cities.
It uses your GPS location, from your device, to pinpoint exactly where you have
parked, and you are able to fine tune the location by moving the pin. If you do
not want to share your location, then that is also perfectly fine, there is a
search bar and you can place the pin accurately for a correct result.

A hosted version is running on GitHub Pages here:
<https://ahmedaa.github.io/parkcheck>.


## How it works

The app pulls data that is publicly available from municipalities in EU, and
stores it in the IndexedDB in the browser. The data pulled is GeoJSON formatted.

Based on the user's location, it will then provide simple feedback on whether or
not it is permissible to park in the spot, and what the conditions for parking
are (time restrictions, payment requirements, etc).

The information shown is based solely on the quality of the raw data. Some
municipalities have much higher data quality than others, which unfortunately
makes the quality of the app differ.

### What it does

- Helps you identifying places that are legal to park.

### What it does not

- Does not know whether there are available spots in a given location.


## Development

If you want to build on this, I am open for PRs. Or just fork and go crazy, up
to you.

```shell
npm install --legacy-peer-deps
```

Then start a dev server with:

```shell
npm run dev
```


## Roadmap

The app is currently in a bit of a crude state. The following needs to be improved:

- The storage and dataSync classes might need to be merged into a single file
  per city (since data quality and fields vary from city to city).
- Ask the user what city they want data from when they first start the app.
- Add settings to allow users to manage which cities they want data for.
- Make the user able to set a "home city", so the map defaults to that city.

Once the above is in place, I personally wanted to expand with other Danish
cities, such as Frederiksberg, Aarhus, Aalborg, and Odense. With that in place,
the app should be mature enough to rapidly expand with the biggest cities all
over Europe, and then gradually build out from there.