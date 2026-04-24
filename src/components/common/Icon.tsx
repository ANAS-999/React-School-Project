import '@fortawesome/fontawesome-free/css/all.min.css';
import './Icon.css';

interface IconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  style?: React.CSSProperties;
}

export const Icon = ({ icon, size = 'md', className = '', style }: IconProps) => {
  const sizeMap = {
    sm: 'fa-sm',
    md: 'fa-lg',
    lg: 'fa-xl',
    xl: 'fa-2xl',
    '2xl': 'fa-3x',
  };

  return (
    <i className={`fas ${icon} ${sizeMap[size]} ${className}`} style={style}></i>
  );
};
