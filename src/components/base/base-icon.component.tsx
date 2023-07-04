'use client';

import { memo, useMemo } from 'react';
import {
  ArrowSquareOut,
  At,
  Brain,
  CaretDown,
  CaretLeft,
  CaretRight,
  CheckCircle,
  CheckFat,
  DoorOpen,
  FlyingSaucer,
  GameController,
  GithubLogo,
  HandEye,
  HandFist,
  Keyhole,
  MagnifyingGlass,
  MapPinLine,
  Minus,
  NumberCircleOne,
  Password,
  PencilSimple,
  Plus,
  Radioactive,
  SelectionSlash,
  Skull,
  Trash,
  UserFocus,
  WarningDiamond,
  X,
} from '@phosphor-icons/react';

import { type Icon, type IconProps } from '@phosphor-icons/react';

export type IconName =
  | 'arrow-square-out'
  | 'at'
  | 'brain'
  | 'caret-down'
  | 'caret-left'
  | 'caret-right'
  | 'check-circle'
  | 'check-fat'
  | 'door-open'
  | 'flying-saucer'
  | 'game-controller'
  | 'github-logo'
  | 'hand-eye'
  | 'hand-fist'
  | 'keyhole'
  | 'magnifying-glass'
  | 'map-pin-line'
  | 'minus'
  | 'number-circle-one'
  | 'password'
  | 'pencil-simple'
  | 'plus'
  | 'radioactive'
  | 'selection-slash'
  | 'skull'
  | 'trash'
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
      case 'caret-down':
        return CaretDown;
      case 'caret-left':
        return CaretLeft;
      case 'caret-right':
        return CaretRight;
      case 'check-circle':
        return CheckCircle;
      case 'check-fat':
        return CheckFat;
      case 'door-open':
        return DoorOpen;
      case 'flying-saucer':
        return FlyingSaucer;
      case 'game-controller':
        return GameController;
      case 'github-logo':
        return GithubLogo;
      case 'hand-eye':
        return HandEye;
      case 'hand-fist':
        return HandFist;
      case 'keyhole':
        return Keyhole;
      case 'magnifying-glass':
        return MagnifyingGlass;
      case 'map-pin-line':
        return MapPinLine;
      case 'minus':
        return Minus;
      case 'number-circle-one':
        return NumberCircleOne;
      case 'password':
        return Password;
      case 'pencil-simple':
        return PencilSimple;
      case 'plus':
        return Plus;
      case 'radioactive':
        return Radioactive;
      case 'selection-slash':
        return SelectionSlash;
      case 'skull':
        return Skull;
      case 'trash':
        return Trash;
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
