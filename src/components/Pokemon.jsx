import React, {useEffect, useState} from 'react'
import PokemonCard from './PokemonCard'
import './Pokemon.css'

const MAX_POKEMON_ID = 1025

const Pokemon = () => {
  const [pokemonList, setPokemonList] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchedPokemon, setSearchedPokemon] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPokemon = async () => {
    setLoading(true)
    setMessage('')

    try {
        const randomID = new Set()
        while (randomID.size < 20) {
            randomID.add(Math.floor(Math.random() * MAX_POKEMON_ID) + 1)
        }

        const pokemonData = await Promise.all(
            Array.from(randomID).map(async (id) => {
              const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
              return await pokemonResponse.json()
            })
          )
          setPokemonList(pokemonData)
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
      setMessage('Error fetching Pokemon. Please try again.')
    }  finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPokemon()
  }, [])

  const searchPokemon = async() => {
    const term = searchTerm.toLowerCase().trim()
    if (term === '') {
      setSearchedPokemon(null)
      setMessage('Type in a Pokemon name or ID to search for.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`)
      if (!response.ok) {
        setSearchedPokemon(null)
        setMessage(`No Pokemon found with name or ID: ${searchTerm}`)
        return
      }
      const data = await response.json()
      setSearchedPokemon(data)
    } catch (error) {
      console.error('Error searching Pokemon:', error)
      setSearchedPokemon(null)
      setMessage('Error searching Pokemon. Please try again.')
    }  finally {
      setLoading(false)
    }
  }  

  return (
    <div className="pokemon">
      <h1>Pokemon</h1>

      {searchedPokemon && (
        <div className="search-result">
          <h2>Search Result:</h2>
          <PokemonCard 
          pokemon={searchedPokemon} onSelect={setSelectedPokemon} />
        </div>
      )}

      <div className="search">
        <input
          type="text"
          placeholder="Search Pokemon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchPokemon()}
        />

        <button onClick={searchPokemon} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        
        {searchedPokemon && (
          <button onClick={() => {
            setSearchedPokemon(null)
            setSearchTerm('')
            setMessage('')
          }}>
            Clear
          </button>
        )}  
      </div>

      {message && <p className="message">{message}</p>}

      <button onClick={fetchPokemon} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Pokemon'}
      </button>

      {pokemonList.length > 0 && (
        <div>
          <h2>All Pokemon ({pokemonList.length})</h2>
          <div className="pokemon-list">
            {pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={setSelectedPokemon} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Pokemon
