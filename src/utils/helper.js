//get Pokemon Sprite
export function getPokemonSprite(sprites) {
  const spriteOptions = [
    sprites.front_default,
    sprites.front_female,
    sprites.front_shiny,
    sprites.front_shiny_female,
    sprites.back_default,
    sprites.back_female,
    sprites.back_shiny,
    sprites.back_shiny_female,

    sprites.other?.["dream_world"]?.front_default,
    sprites.other?.["dream_world"]?.front_female,

    sprites.other?.home?.front_default,
    sprites.other?.home?.front_female,
    sprites.other?.home?.front_shiny,
    sprites.other?.home?.front_shiny_female,

    sprites.other?.["official-artwork"]?.front_default,
    sprites.other?.["official-artwork"]?.front_shiny,

    sprites.other?.showdown?.front_default,
    sprites.other?.showdown?.front_female,
    sprites.other?.showdown?.front_shiny,
    sprites.other?.showdown?.front_shiny_female,
    sprites.other?.showdown?.back_default,
    sprites.other?.showdown?.back_female,
    sprites.other?.showdown?.back_shiny,
    sprites.other?.showdown?.back_shiny_female,
  ];

  return spriteOptions.find((sprite) => sprite !== null) || "";
}

// Format name for display
export function formatNameForDisplay(name) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
