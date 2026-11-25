import React from "react";

const PokemonCard = ({ pokemon }) => {
    const image = 
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
     pokemon.sprites?.front_default;

  return (
    <div className="pokemon-card">
        <img src={image} alt={pokemon.name} />
        <h3>#{pokemon.id} {pokemon.name}</h3>

        <div className="pokemon-types">
            <strong>Type: </strong>
            {pokemon.types.map((typeInfo) => (
                <span key={typeInfo.slot} className={`pokemon-type ${typeInfo.type.name}`}>
                    {typeInfo.type.name}
                </span>
            ))}
        </div>

        <div className="pokemon-abilities">
            <strong>Abilities: </strong>
            <span>
                {pokemon.abilities.map((abilityInfo) => abilityInfo.is_hidden ? 
                `'${abilityInfo.ability.name}'` : abilityInfo.ability.name).join(', ')}
            </span>
        </div>
    </div>
  );
}

export default PokemonCard;