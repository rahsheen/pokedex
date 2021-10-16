import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMON_SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species";

type Pokemon = {
  name: string;
  url: string;
  sprites: any;
};

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return <img src={pokemon?.sprites?.frontdefault} alt={pokemon.name} />;
}

function App() {
  const [species, setSpecies] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target?.value);

  useEffect(() => {
    fetch(POKEMON_SPECIES_URL)
      .then((r) => r.json())
      .then(({ results }) => setSpecies(results))
      .catch(console.error);
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

    Promise.all(promises).then(setSearchResults).catch(console.error);
  }, [searchText, species]);

  return (
    <div className="App">
      <input type="text" onChange={onChange} value={searchText} />
      {searchResults.map((p) => (
        <PokemonCard key={p.name} pokemon={p} />
      ))}
    </div>
  );
}

export default App;
