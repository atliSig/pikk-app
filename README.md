# Pikk

## Uppsetning ##
* Ná í Node
* Node dependencies : ``` npm install ```
* Installa bower : ``` npm install bower ```
* Bower dependencies: farið í assets og ``` bower install ```
* [OPT] Ná í WebStorm
* [OPT] Ná í .ignore plugin fyrir WebStorm

## Setja Upp Environment ##
Búið til .env í pikk directory-inu, látið eftirfarandi inn þar með lyklunum af lastPass:

```
SEARCH_KEY=[key goes here]
STAR_KEY=[key goes here]
```

## Frontend Pakkar ##
Við höfum bower_components í assets og þar af leiðandi er hægt að hafa t.d. aðgengi að jquery í ``` assets/bower_components/jquery/dist/jquery.min.js ```
Við notum síðan **AngularJS 2.0** fyrir framendann okkar sem er undir ``` /assets/angular/ ```

## Önnur atriði ##
* ```pipeline.js``` er undir ```tasks```
* Notum **Less** í stað **CSS**, en Sails sér um að compila það.

## Browser / Live Edit ##
* Run -> Edit Configurations
* ýta á plús og velja Node.js og skýrið t.d. bara Pikk
* Node interpreter : ``` /usr/bin/node ``` (ubuntu). Ef þið settuð þetta sem environment variable á Win þá ætti þetta að birtast sjálfkrafa.
* Working directory:  Bara það sem þið eruð að nota
* JavaScript file : ``` bin/www ```
* Environment variables: ``` DEBUG=pikk-app:* ```
* Farið svo á Live Edit, hakið í after launch og veljið bara default, Express ræsist by default á ``` localhost:3000 ``` svo það þarf að skrifa það þar.

## PostgreSQL / Uppsetning ##
### Linux
* Ná í postgreSQL: 
```
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
$ wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -

$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib

$ sudo -u postgres createuser --superuser pikk
```
* Nú er kominn notandi pikk í gagnagrunninn. Til að breyta lykilorðinu er hægt að gera 
```
$ psql postgres
pikkdb=# \password pikk
```
* Lykilorðið er svo slegið inn og staðfest.

* Til að búa til gagnagrunninn er svo hægt að keyra skránna ``script.sql```.
```
pikkdb=# \i PATH_TO_FILE
```

* Til að nota PGadmin í vafra þarf að ná í pakkann:
```$ sudo apt-get install phppgadmin```

* Hægt er að keyra upp clientinn á ```http://localhost/phppgadmin```