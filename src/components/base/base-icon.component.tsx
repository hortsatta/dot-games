'use client';

import { memo, useMemo } from 'react';
import {
  At,
  Brain,
  FlyingSaucer,
  GameController,
  HandEye,
  HandFist,
  Keyhole,
  MagnifyingGlass,
  Password,
  Radioactive,
  Skull,
  UserFocus,
  WarningDiamond,
} from '@phosphor-icons/react';

import { type Icon, type IconProps } from '@phosphor-icons/react';

export type IconName =
  | 'at'
  | 'brain'
  | 'flying-saucer'
  | 'game-controller'
  | 'hand-eye'
  | 'hand-fist'
  | 'keyhole'
  | 'magnifying-glass'
  | 'password'
  | 'radioactive'
  | 'skull'
  | 'user-focus'
  | 'warning-diamond';

type Props = IconProps & {
  name: IconName;
};

const BaseIcon = memo(function BaseIcon({ name, ...moreProps }: Props) {
  const Icon: Icon | null = useMemo(() => {
    switch (name) {
      case 'at':
        return At;
      case 'brain':
        return Brain;
      case 'flying-saucer':
        return FlyingSaucer;
      case 'game-controller':
        return GameController;
      case 'hand-eye':
        return HandEye;
      case 'hand-fist':
        return HandFist;
      case 'keyhole':
        return Keyhole;
      case 'magnifying-glass':
        return MagnifyingGlass;
      case 'password':
        return Password;
      case 'radioactive':
        return Radioactive;
      case 'skull':
        return Skull;
      case 'user-focus':
        return UserFocus;
      case 'warning-diamond':
        return WarningDiamond;
      default:
        return null;
    }
  }, [name]);

  if (!Icon) {
    return null;
  }

  return <Icon {...moreProps} />;
});

export default BaseIcon;
