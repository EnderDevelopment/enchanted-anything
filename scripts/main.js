import { world, system, ItemStack } from "@minecraft/server";

const ENCHANTMENTS = [
  ["aqua_affinity", "Aqua Affinity", 1], ["bane_of_arthropods", "Bane of Arthropods", 5],
  ["blast_protection", "Blast Protection", 4], ["channeling", "Channeling", 1], ["depth_strider", "Depth Strider", 3],
  ["efficiency", "Efficiency", 5], ["feather_falling", "Feather Falling", 4], ["fire_aspect", "Fire Aspect", 2],
  ["fire_protection", "Fire Protection", 4], ["flame", "Flame", 1], ["fortune", "Fortune", 3], ["frost_walker", "Frost Walker", 2],
  ["impaling", "Impaling", 5], ["infinity", "Infinity", 1], ["knockback", "Knockback", 2], ["looting", "Looting", 3],
  ["loyalty", "Loyalty", 3], ["luck_of_the_sea", "Luck of the Sea", 3], ["lure", "Lure", 3], ["mending", "Mending", 1],
  ["multishot", "Multishot", 1], ["piercing", "Piercing", 4], ["power", "Power", 5], ["projectile_protection", "Projectile Protection", 4],
  ["protection", "Protection", 4], ["punch", "Punch", 2], ["quick_charge", "Quick Charge", 3], ["respiration", "Respiration", 3],
  ["riptide", "Riptide", 3], ["sharpness", "Sharpness", 5], ["silk_touch", "Silk Touch", 1], ["smite", "Smite", 5],
  ["soul_speed", "Soul Speed", 3], ["sweeping_edge", "Sweeping Edge", 3], ["swift_sneak", "Swift Sneak", 3], ["thorns", "Thorns", 3],
  ["unbreaking", "Unbreaking", 3]
];

const PAYMENTS = [
  { id: "minecraft:lapis_lazuli", amount: 32 },
  { id: "minecraft:iron_ingot", amount: 16 },
  { id: "minecraft:emerald", amount: 8 }
];

function inventory(player) {
  return player.getComponent("minecraft:inventory")?.container;
}

function count(container, typeId) {
  let total = 0;
  for (let slot = 0; slot < container.size; slot++) {
    const item = container.getItem(slot);
    if (item?.typeId === typeId) total += item.amount;
  }
  return total;
}

function remove(container, typeId, amount) {
  let remaining = amount;
  for (let slot = 0; slot < container.size && remaining > 0; slot++) {
    const item = container.getItem(slot);
    if (item?.typeId !== typeId) continue;
    const removed = Math.min(item.amount, remaining);
    item.amount -= removed;
    remaining -= removed;
    container.setItem(slot, item.amount > 0 ? item : undefined);
  }
}

function giveRandomBook(player) {
  const choice = ENCHANTMENTS[Math.floor(Math.random() * ENCHANTMENTS.length)];
  const level = 1 + Math.floor(Math.random() * choice[2]);
  const book = new ItemStack("minecraft:enchanted_book", 1);
  const enchantable = book.getComponent("minecraft:enchantable");
  if (!enchantable) return;
  enchantable.addEnchantment({ type: choice[0], level });
  inventory(player).addItem(book);
  player.sendMessage(`§dEnchanter §7gave you a §b${choice[1]} ${level}§7 book.`);
}

function enchantHeldItem(player, name, requestedLevel) {
  const container = inventory(player);
  const item = container?.getItem(player.selectedSlotIndex);
  if (!item) {
    player.sendMessage("§cHold an item first.");
    return;
  }
  const definition = ENCHANTMENTS.find((entry) => entry[0] === name.toLowerCase());
  if (!definition) {
    player.sendMessage("§cUnknown enchantment. Use §f/scriptevent ender:list§c.");
    return;
  }
  const level = Math.max(1, Math.min(Number(requestedLevel) || definition[2], 255));
  const enchantable = item.getComponent("minecraft:enchantable");
  if (!enchantable) {
    player.sendMessage("§cThis item cannot hold native Bedrock enchantments.");
    return;
  }
  try {
    enchantable.addEnchantment({ type: definition[0], level });
  } catch {
    const lore = item.getLore();
    const line = `§b${definition[1]} ${level}`;
    if (!lore.includes(line)) lore.push(line);
    item.setLore(lore);
  }
  container.setItem(player.selectedSlotIndex, item);
  player.sendMessage(`§aApplied §b${definition[1]} ${level}§a. Minimum player level: 5.`);
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  if (event.block.typeId !== "minecraft:enchanting_table") return;
  event.cancel = true;
  const player = event.player;
  system.run(() => {
    if (player.level < 5) {
      player.sendMessage("§cYou need at least 5 experience levels to use this enchanter.");
      return;
    }
    const container = inventory(player);
    const payment = PAYMENTS.find((option) => count(container, option.id) >= option.amount);
    if (!payment) {
      player.sendMessage("§cPay 32 lapis, 16 iron, or 8 emeralds to receive a random enchanted book.");
      return;
    }
    remove(container, payment.id, payment.amount);
    player.addExperience(-5);
    giveRandomBook(player);
  });
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;
  if (!player || player.typeId !== "minecraft:player") return;
  if (event.id === "ender:list") {
    player.sendMessage(`§eEnchantments: §f${ENCHANTMENTS.map((entry) => entry[0]).join(", ")}`);
    return;
  }
  if (event.id !== "ender:enchant") return;
  if (player.level < 5) {
    player.sendMessage("§cYou need at least 5 experience levels.");
    return;
  }
  const args = event.message.trim().split(/\s+/);
  if (!args[0] || args[0] === "help") {
    player.sendMessage("§eUse: /scriptevent ender:enchant <name> [level]");
    player.sendMessage("§eUse: /scriptevent ender:list");
    return;
  }
  enchantHeldItem(player, args[0], args[1]);
});

world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) event.player.sendMessage("§dEnder Enchanter §7ready. Use an enchanting table with level 5 and lapis, iron, or emeralds.");
});
