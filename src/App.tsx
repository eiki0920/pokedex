import { useEffect, useState, FC } from "react";
import "./App.css";
import Card from "./components/Card";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Navbar from "./components/Navbar";

export const App: FC = () => {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState<boolean>(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState<string>("");
  const [prevURL, setPrevURL] = useState<string>("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res: any = await getAllPokemon(initialURL);
      // console.log(res);

      // 各ポケモンの詳細データを取得
      loadPokemon(res.results);
      console.log(res.results);

      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data: any) => {
    let _pokemonData: any = await Promise.all(
      data.map((pokemon: any) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  const handlePrevPage = async () => {
    if (!prevURL) return;
    setLoading(true);
    let data: any = await getAllPokemon(prevURL);
    console.log(data);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let data: any = await getAllPokemon(nextURL);
    // console.log(data);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
