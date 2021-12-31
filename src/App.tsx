import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMON_SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species";

type Pokemon = {
  name: string;
  url: string;
  sprites: Record<string, string>;
  types: Array<Record<string, { name: string }>>;
  abilities: Array<Record<string, { name: string }>>;
  description: any;
};

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { sprites, types, abilities, description } = pokemon;

  const abilitiesString = abilities
    .map(({ ability: { name } }) => name)
    .join(",");

  const typesString = types.map(({ type: { name } }) => name).join(",");

  return (
    <div className="p2 m2 sm-col-1 bg-white border rounded">
      <h4>{pokemon.name}</h4>
      <img src={sprites?.front_default} alt={pokemon.name} />
      <p>{abilitiesString}</p>
      <p>{typesString}</p>
    </div>
  );
}

function App() {
  const [species, setSpecies] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target?.value);

  useEffect(() => {
    const loadSpecies = (url: string) =>
      fetch(url)
        .then((r) => r.json())
        .then(({ results, next }) => {
          setSpecies((prev) => [...prev, ...results]);
          if (next) loadSpecies(next);
        });

    loadSpecies(POKEMON_SPECIES_URL);
  }, []);

  useEffect(() => {
    const filteredSpecies = searchText
      ? species.filter(({ name }) => name.startsWith(searchText))
      : species;

    const promises = filteredSpecies.map(({ name }) =>
      fetch(`${POKEMON_URL}/${name}`)
        .then((r) => r.json())
        .catch(console.error)
    );

    Promise.all(promises)
      .then((results) => setSearchResults(results.filter((r) => r)))
      .catch(console.error);
  }, [searchText, species]);

  return (
    <div className="App">
      <input type="text" onChange={onChange} value={searchText} />
      <div className="flex flex-row flex-wrap">
        {searchResults.map((p) => (
          <PokemonCard key={p.name} pokemon={p} />
        ))}
      </div>
    </div>
  );
}

export default App;
