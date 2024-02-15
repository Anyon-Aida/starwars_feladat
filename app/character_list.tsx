/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SelectedCharacter from './SelectedCharacter';

interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[]; 
}

interface Film {
  title: string;
  url: string;
}

interface Planet {
  name: string;
  url: string;
}

const CharacterList = () => {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilm, setSelectedFilm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [charactersLoaded, setCharactersLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadedImages(0);
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
        setAllCharacters(response.data.results);
        setLoading(false);
        setCharactersLoaded(true);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        setLoading(false);
      }
    };

    const fetchFilms = async () => {
      try {
        const response = await axios.get('https://swapi.dev/api/films/');
        setFilms(response.data.results);
      } catch (error) {
        console.error("Failed to fetch films:", error);
      }
    };

    const fetchPlanets = async () => {
      try {
        const response = await axios.get('https://swapi.dev/api/planets/');
        setPlanets(response.data.results);
      } catch (error) {
        console.error("Failed to fetch planets:", error);
      }
    };

    fetchCharacters();
    fetchFilms();
    fetchPlanets();
  }, [page]);

  useEffect(() => {
    setFilteredCharacters(
      allCharacters.filter(character => 
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedFilm ? character.films.includes(selectedFilm) : true) &&
        (selectedPlanet ? character.homeworld === selectedPlanet : true)
      )
    );
  }, [allCharacters, searchTerm, selectedFilm, selectedPlanet]);

  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleReset = () => {
    setSelectedCharacter(null);
  };

  if (loading) {
    return(
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {selectedCharacter ? (
        <div className="w-full max-w-7xl px-4 py-8">
          <SelectedCharacter character={selectedCharacter} />
          <button onClick={handleReset} className="bg-mirage-300 hover:bg-mirage-400 text-mirage-950 font-bold py-2 px-4 mt-6 rounded">
            Back to Character List
          </button>
        </div>
      ) : (
        charactersLoaded && (
          <div className="w-full max-w-7xl px-4 py-8">
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search character..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-gray-100 rounded-md py-2 px-4 w-96"
              />
              <select
                value={selectedFilm}
                onChange={e => setSelectedFilm(e.target.value)}
                className="bg-gray-100 rounded-md py-2 px-4"
              >
                <option value="">Filter by film</option>
                {films.map(film => (
                  <option key={film.url} value={film.url}>{film.title}</option>
                ))}
              </select>
              <select
                value={selectedPlanet}
                onChange={e => setSelectedPlanet(e.target.value)}
                className="bg-gray-100 rounded-md py-2 px-4"
              >
                <option value="">Filter by planet</option>
                {planets.map(planet => (
                  <option key={planet.url} value={planet.url}>{planet.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredCharacters.map(character => (
                <div key={character.name} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out" onClick={() => handleCharacterClick(character)}>
                  <img src={`https://picsum.photos/seed/${character.name}/200/300`} alt={character.name} className="w-full h-56 object-cover object-center" onLoad={handleImageLoad} />
                  <div className="p-4">
                    <h2 className="font-bold text-xl mb-2">{character.name}</h2>
                    <p><strong>Születési év:</strong> {character.birth_year}</p>
                    <p><strong>Nem:</strong> {character.gender === 'male' ? 'Férfi' : character.gender === 'female' ? 'Nő' : 'Ismeretlen'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              <button onClick={handlePrevPage} disabled={page <= 1} className="bg-mirage-300 hover:bg-mirage-400 text-mirage-950 font-bold py-2 px-4 rounded-l">
                Prev
              </button>
              <button onClick={handleNextPage} className="bg-mirage-300 hover:bg-mirage-400 text-mirage-950 font-bold py-2 px-4 rounded-r">
                Next
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CharacterList;
