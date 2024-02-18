--1a
select przedszkola.Nazwa_przedszkola, count(*) as ilosc from przedszkola join dzieci on dzieci.Id_przedszkola = przedszkola.Id_przedszkola group by przedszkola.Id_przedszkola;

--1b
select przedszkola.Nazwa_przedszkola, count(*) as ilosc from przedszkola join dzieci on dzieci.Id_przedszkola = przedszkola.Id_przedszkola
where dzieci.Wiek = 3
group by przedszkola.Id_przedszkola;

--1c

select dzieci.Nazwisko,dzieci.Imie,przedszkola.Nazwa_przedszkola from dzieci
    inner join przedszkola
    on przedszkola.Id_przedszkola = dzieci.Id_przedszkola
having przedszkola.Nazwa_przedszkola like "%Zuch%";

--1D
select dzieci.Nazwisko,dzieci.Imie,przedszkola.Id_przedszkola from dzieci
    inner join przedszkola
    on przedszkola.Id_przedszkola = dzieci.Id_przedszkola
having przedszkola.Id_przedszkola in (14,8,28,27);

--1H
select * from dzieci
    inner join przedszkola
    on przedszkola.Id_przedszkola = dzieci.Id_przedszkola
where dzieci.Wiek = 5
having przedszkola.Nazwa_przedszkola LIKE '%smerf%' or '%stokrotka%'
order by dzieci.Nazwisko desc;