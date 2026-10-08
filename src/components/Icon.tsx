/**
 * Draws one icon from the shared icon data.
 *
 * `render.php` draws the same icons on the public page from the same data with the
 * same settings, so an icon cannot look different in the editor.
 */
import { getIcon, ICON_SVG_SETTINGS } from '../icons';

interface IconProps {
  /** The icon name from `data/icons.json`, for example 'shield'. */
  name: string;
  /** A class name for styling, for example the size. */
  className?: string;
}

/**
 * The icon component.
 *
 * Icons are decoration. The text next to them carries the meaning, so the SVG is
 * hidden from screen readers and from the keyboard focus order.
 *
 * @param props           The component props.
 * @param props.name      The icon name.
 * @param props.className A class name for styling.
 *
 * @return The SVG element, or nothing when the icon name is unknown.
 */
export default function Icon({ name, className }: IconProps) {
  const icon = getIcon(name);

  if (!icon) {
    return null;
  }

  return (
    <svg
      className={className}
      viewBox={ICON_SVG_SETTINGS.viewBox}
      fill={icon.filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={ICON_SVG_SETTINGS.strokeWidth}
      strokeLinejoin={ICON_SVG_SETTINGS.strokeLinejoin}
      aria-hidden="true"
      focusable="false"
    >
      {icon.paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
