import '@fortawesome/fontawesome-free/css/all.min.css';
import './Icon.css';

interface IconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const Icon = ({ icon, size = 'md', className = '', style, title }: IconProps) => {
  const sizeMap = {
    sm: 'fa-sm',
    md: 'fa-lg',
    lg: 'fa-xl',
    xl: 'fa-2xl',
    '2xl': 'fa-3x',
  };

  // Check if icon string already contains the prefix (fa-solid, fa-brands, fas, fab, etc.)
  const hasPrefix = icon.startsWith('fas ') || icon.startsWith('fab ') || icon.startsWith('far ') || icon.startsWith('fal ') || icon.startsWith('fa-solid ') || icon.startsWith('fa-brands ') || icon.startsWith('fa-regular ');
  const fullIconClass = hasPrefix ? icon : `fas ${icon}`;

  return (
    <i className={`${fullIconClass} ${sizeMap[size]} ${className}`} style={style} title={title}></i>
  );
};
