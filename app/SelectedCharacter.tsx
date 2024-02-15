/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import axios from 'axios';

interface CharacterProps {
  character: {
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
  };
}

interface PlanetData {
  name: string;
  climate: string;
  terrain: string;
}


const SelectedCharacter: React.FC<CharacterProps> = ({ character }) => {

  const [planetData, setPlanetData] = useState<PlanetData | null>(null);

  useEffect(() => {
    const fetchPlanetData = async () => {
      try {
        const response = await axios.get(character.homeworld);
        const planetInfo: PlanetData = {
          name: response.data.name,
          climate: response.data.climate,
          terrain: response.data.terrain,
        };
        setPlanetData(planetInfo);
      } catch (error) {
        console.error('Failed to fetch planet data:', error);
      }
    };

    if (character.homeworld) {
      fetchPlanetData();
    }
  }, [character.homeworld]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="p-12 space-y-8">
          <h2 className="font-bold text-6xl mb-8 text-gray-800 text-center">{character.name}</h2>
          <div className="grid grid-cols-2 gap-x-12">
            <div>
              <p className="text-xl"><strong>Születési év:</strong> {character.birth_year}</p>
              <p className="text-xl"><strong>Nem:</strong> {character.gender === 'male' ? 'Férfi' : character.gender === 'female' ? 'Nő' : 'Ismeretlen'}</p>
              <p className="text-xl"><strong>Magasság:</strong> {character.height} cm</p>
              <p className="text-xl"><strong>Tömeg:</strong> {character.mass} kg</p>
            </div>
            <div>
              <p className="text-xl"><strong>Hajszín:</strong> {character.hair_color}</p>
              <p className="text-xl"><strong>Bőrszín:</strong> {character.skin_color}</p>
              {planetData && (
                <>
                  <p className="text-xl"><strong>Szülőbolygó:</strong> {planetData.name}</p>
                  <p className="text-xl"><strong>Klíma:</strong> {planetData.climate}</p>
                  <p className="text-xl"><strong>Terep:</strong> {planetData.terrain}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedCharacter;