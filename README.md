# Minecraft Universal Enchantment Plugin

Enchanted Anything is a Minecraft Bedrock behavior pack and script plugin that expands enchanting-table and item-enchantment mechanics with universal enchantment commands, random enchanted books, resource payments, and support for applying listed enchantments to compatible items or recording incompatible enchantments in item lore.

## Install

1. Locate the behavior pack folder containing `manifest.json`.
2. Copy the behavior pack folder into your Minecraft Bedrock `behavior_packs` directory.
3. Open the world settings.
4. Activate the `Ender Universal Enchants` behavior pack.
5. Enable Beta APIs or the experiments required by your Minecraft version.
6. Enter or re-enter the world.
7. Confirm that the pack uses Minecraft Bedrock 1.20.80 or newer and the `@minecraft/server` 1.17.0 script API.

## Use

### Enchanting table

1. Reach at least experience level 5.
2. Carry at least one of these payments:
   - 32 lapis lazuli
   - 16 iron ingots
   - 8 emeralds
3. Interact with an enchanting table.
4. The pack cancels the normal enchanting-table interface.
5. The first payment type you can afford is removed.
6. Five experience levels are consumed.
7. You receive one random enchanted book with a random level between 1 and that enchantment's normal maximum.

### Universal enchant command

1. Hold an item in your selected hotbar slot.
2. Make sure you have at least 5 experience levels.
3. Run:

```text
/scriptevent ender:enchant <enchantment> [level]
```

4. Replace `<enchantment>` with a supported enchantment name.
5. The optional level defaults to the enchantment's normal maximum and is limited to 255.
6. The command requires at least level 5, but applying an enchantment through the command does not consume experience.
7. Compatible enchantments are added as native Bedrock enchantments. When Bedrock rejects an incompatible enchantment, the enchantment name and level are recorded in the item's lore when the item supports enchantment data.

To list supported enchantment names, run:

```text
/scriptevent ender:list
```

Supported names include:

`aqua_affinity`, `bane_of_arthropods`, `blast_protection`, `channeling`, `depth_strider`, `efficiency`, `feather_falling`, `fire_aspect`, `fire_protection`, `flame`, `fortune`, `frost_walker`, `impaling`, `infinity`, `knockback`, `looting`, `loyalty`, `luck_of_the_sea`, `lure`, `mending`, `multishot`, `piercing`, `power`, `projectile_protection`, `protection`, `punch`, `quick_charge`, `respiration`, `riptide`, `sharpness`, `silk_touch`, `smite`, `soul_speed`, `sweeping_edge`, `swift_sneak`, `thorns`, and `unbreaking`.

---

More Minecraft plugin projects by EnderDevelopment: https://github.com/EnderDevelopment

Project page: https://dash.enderdevelopment.com/community/8620aef3-da51-4533-924d-51677cd6ca70?utm_source=github&utm_medium=readme&utm_campaign=auto_publish&utm_content=8620aef3-da51-4533-924d-51677cd6ca70
