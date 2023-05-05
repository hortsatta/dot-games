'use client';

import { useMemo } from 'react';
import {
  Brain,
  FlyingSaucer,
  GameController,
  MagnifyingGlass,
  Skull,
} from '@phosphor-icons/react';

import { type Icon, type IconProps } from '@phosphor-icons/react';

export type IconName =
  | 'brain'
  | 'flying-saucer'
  | 'game-controller'
  | 'magnifying-glass'
  | 'skull';

type Props = IconProps & {
  name: IconName;
};

const BaseIcon = ({ name, ...moreProps }: Props) => {
  const Icon: Icon | null = useMemo(() => {
    switch (name) {
      case 'brain':
        return Brain;
      case 'flying-saucer':
        return FlyingSaucer;
      case 'game-controller':
        return GameController;
      case 'magnifying-glass':
        return MagnifyingGlass;
      case 'skull':
        return Skull;
      default:
        return null;
    }
  }, [name]);

  if (!Icon) {
    return null;
  }

  return <Icon weight='light' {...moreProps} />;
};

export default BaseIcon;
