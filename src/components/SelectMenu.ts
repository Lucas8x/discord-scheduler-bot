import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';

type SelectMenuOptions = {
  customId: string;
  placeholder: string;
  options: unknown[];
  identifiers?: [value: string, label: string];
};

export function SelectMenu({
  customId,
  placeholder,
  options,
  identifiers,
}: SelectMenuOptions) {
  const items = options.map((i) => {
    const hasIdentifiers = identifiers && identifiers.length === 2;

    return new StringSelectMenuOptionBuilder()
      .setValue(hasIdentifiers ? i[identifiers[0]] : i)
      .setLabel(hasIdentifiers ? i[identifiers[1]] : i);
  });

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .addOptions(items),
  );
}
