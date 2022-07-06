# Katedrová dochádzková webová aplikácia

[web](https://www.st.fmph.uniba.sk/~rigan7/bp/)

Na spustenie je potrebné mať nainštalovaný [node.js](https://github.com/nodejs/node)

Priamo v priečinku repozitára sa spustí príkaz ```npm install``` pre nainštalovanie aplikácie. <br>
Používateľské rozhranie sa spustí skriptom ```npm start```. <br>
Ak by sa nechcelo správne spustiť, je tu možnosť opravy príkazom ```npm audit fix```.<br>

Skripty pre vytvorenie databázy sa nachádzajú v priečinku ```server/database-scripts```.<br>
- ```create.sql``` - pripraví schému databázy
- ```migrate.sql``` - upraví schému databázy o nové zmeny

Server sa nachádza v priečinku ```server```. Jeho taktiež treba nainštalovať príkazom ```npm install```.
V priečinku ```server``` je potrebné vytvoriť súbor ```.env```, ktorý obsahuje dôležité konštanty:
- ```DB_HOST``` - adresa servera s databázou
- ```DB_USER``` - používateľské meno do databázy
- ```DB_PASS``` - heslo do databázy
- ```DB_NAME``` - názov schémy v databáze
- ```PORT``` - port servera
- ```SECRET_TOKEN``` - ľubovoľný textový reťazec, používa sa na podpisovanie JWT
- ```TOKEN_EXPIRATION``` - dlžka platnosti JWT, napríklad "7d" - sedem dní

Server sa spustí príkazom ```node app.js```

