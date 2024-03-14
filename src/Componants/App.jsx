import React, { useState, useEffect } from "react";
import Card from "./Card";
import Pokemoninfo from "./Pokemoninfo";
import axios from "axios";

const App = () => {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokeDex] = useState();
    const [showPopup, setShowPopup] = useState(false);

    const pokeFun = async () => {
        setLoading(true);
        const res = await axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results);
        setLoading(false);
    };

    const getPokemon = async (res) => {
        const pokemonDetails = await Promise.all(res.map(async (item) => {
            const result = await axios.get(item.url);
            return result.data;
        }));
        
        setPokeData((state) => {
            state = [...state, ...pokemonDetails];
            state.sort((a, b) => a.id > b.id ? 1 : -1);
            return state;
        });
    };

    useEffect(() => {
        pokeFun();
    }, [url]);

    const handlePopup = (poke) => {
        setPokeDex(poke);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handlePrevClick = () => {
        setShowPopup(false); // Close the popup when clicking on "Previous"
        setPokeData([]);
        setUrl(prevUrl);
    };

    const handleNextClick = () => {
        setShowPopup(false); // Close the popup when clicking on "Next"
        setPokeData([]);
        setUrl(nextUrl);
    };

    return (
        <>
            <div className="navbar">
                <img src="https://pngimg.com/d/pokemon_PNG98.png" alt="Pokemon Logo" />
            </div>
            <div className="container">
                <div className="left-content">
                    <Card pokemon={pokeData} loading={loading} infoPokemon={handlePopup} />
                </div>
                <div className="right-content">
                    {showPopup && (
                        <div className="popup">
                            <button className="close-btn" onClick={closePopup}>Close</button>
                            <Pokemoninfo data={pokeDex} />
                        </div>
                    )}
                </div>
            </div>
                    <div className="btn-group">
                        {prevUrl && <button onClick={handlePrevClick}>Previous</button>}
                        {nextUrl && <button onClick={handleNextClick}>Next</button>}
                    </div>
        </>
    );
};

export default App;

