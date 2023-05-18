'use client';

import { memo, useMemo } from 'react';
import {
  ArrowSquareOut,
  At,
  Brain,
  CaretLeft,
  CaretRight,
  CheckCircle,
  DoorOpen,
  FlyingSaucer,
  GameController,
  HandEye,
  HandFist,
  Keyhole,
  MagnifyingGlass,
  Minus,
  NumberCircleOne,
  Password,
  Plus,
  Radioactive,
  SelectionSlash,
  Skull,
  UserFocus,
  WarningDiamond,
  X,
} from '@phosphor-icons/react';

import { type Icon, type IconProps } from '@phosphor-icons/react';

export type IconName =
  | 'arrow-square-out'
  | 'at'
  | 'brain'
  | 'caret-left'
  | 'caret-right'
  | 'check-circle'
  | 'door-open'
  | 'flying-saucer'
  | 'game-controller'
  | 'hand-eye'
  | 'hand-fist'
  | 'keyhole'
  | 'magnifying-glass'
  | 'minus'
  | 'number-circle-one'
  | 'password'
  | 'plus'
  | 'radioactive'
  | 'selection-slash'
  | 'skull'
  | 'user-focus'
  | 'warning-diamond'
  | 'x';

type Props = IconProps & {
  name: IconName;
};

const BaseIcon = memo(function BaseIcon({ name, ...moreProps }: Props) {
  const Icon: Icon | null = useMemo(() => {
    switch (name) {
      case 'at':
        return At;
      case 'arrow-square-out':
        return ArrowSquareOut;
      case 'brain':
        return Brain;
      case 'caret-left':
        return CaretLeft;
      case 'caret-right':
        return CaretRight;
      case 'check-circle':
        return CheckCircle;
      case 'door-open':
        return DoorOpen;
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
      case 'minus':
        return Minus;
      case 'number-circle-one':
        return NumberCircleOne;
      case 'password':
        return Password;
      case 'plus':
        return Plus;
      case 'radioactive':
        return Radioactive;
      case 'selection-slash':
        return SelectionSlash;
      case 'skull':
        return Skull;
      case 'user-focus':
        return UserFocus;
      case 'warning-diamond':
        return WarningDiamond;
      case 'x':
        return X;
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
