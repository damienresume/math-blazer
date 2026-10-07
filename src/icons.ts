/**
 * Typed access to the icon shapes in `data/icons.json`.
 *
 * PHP draws the same icons on the public page from the same file, with the same
 * drawing settings, so an icon looks the same in the editor and on the public page.
 * This file only reads the data. The React component that draws it is in
 * `components/Icon.tsx`.
 */
import iconData from '../data/icons.json';

/**
 * The description of one icon.
 */
export interface IconDefinition {
  /** When true the icon is painted solid. When false only the outline is drawn. */
  readonly filled: boolean;
  /** The SVG path strings that make up the icon, on a 24 by 24 grid. */
  readonly paths: readonly string[];
}

/**
 * The drawing settings that every icon uses.
 *
 * These come from the JSON file so that PHP and TypeScript cannot disagree on, for
 * example, the line width.
 */
export interface IconSvgSettings {
  /** The SVG view box, for example "0 0 24 24". */
  readonly viewBox: string;
  /** The width of the outline, in view box units. */
  readonly strokeWidth: string;
  /** How the corners of the outline are joined. */
  readonly strokeLinejoin: 'round';
}

/**
 * The drawing settings, typed. The cast is needed because a JSON import types the
 * line join as a plain string, and the SVG attribute accepts only a fixed set of words.
 */
export const ICON_SVG_SETTINGS: IconSvgSettings = iconData.svg as IconSvgSettings;

/**
 * All icons by name. The type annotation checks that the JSON file has the right shape.
 */
const ICONS: Readonly<Record<string, IconDefinition>> = iconData.icons;

/**
 * Looks up an icon by name.
 *
 * Saved content and the JSON files can disagree, for example after a rename. The
 * function therefore returns undefined for an unknown name instead of throwing, and
 * the caller decides to draw nothing.
 *
 * @param name The icon name, for example 'shield'.
 *
 * @return The icon description, or undefined when no icon has this name.
 */
export function getIcon(name: string): IconDefinition | undefined {
  return ICONS[name];
}
