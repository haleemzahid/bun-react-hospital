import { ReactNode } from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  buttonText: string;
  buttonColor: 'blue' | 'green' | 'purple';
  onButtonClick: () => void;
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-500',
    text: 'text-blue-700',
    titleText: 'text-blue-900',
    button: 'bg-blue-500 hover:bg-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconBg: 'bg-green-500',
    text: 'text-green-700',
    titleText: 'text-green-900',
    button: 'bg-green-500 hover:bg-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-500',
    text: 'text-purple-700',
    titleText: 'text-purple-900',
    button: 'bg-purple-500 hover:bg-purple-600',
  },
};

export const FeatureCard = ({
  title,
  description,
  icon,
  buttonText,
  buttonColor,
  onButtonClick,
}: FeatureCardProps) => {
  const colors = colorClasses[buttonColor];

  return (
    <div className={`${colors.bg} p-6 rounded-lg border ${colors.border}`}>
      <div className="flex items-center mb-3">
        <div className={`${colors.iconBg} text-white p-2 rounded-full`}>
          {icon}
        </div>
        <h3 className={`ml-3 text-lg font-semibold ${colors.titleText}`}>{title}</h3>
      </div>
      <p className={colors.text}>{description}</p>
      <button
        onClick={onButtonClick}
        className={`inline-block mt-4 ${colors.button} text-white px-4 py-2 rounded transition-colors`}
      >
        {buttonText}
      </button>
    </div>
  );
};
