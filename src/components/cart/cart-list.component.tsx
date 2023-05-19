import { memo, useCallback, useMemo, useState } from 'react';
import { Dialog } from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import SimpleBar from 'simplebar-react';

import BaseTypography from '../base/base-typography.component';
import BaseFieldTitle from '../base/base-field-title.component';
import BaseButton from '../base/base-button.component';
import BaseSurface from '../base/base-surface.component';
import BaseIcon from '../base/base-icon.component';
import CartItemCard from './cart-item-card.component';

import type { ComponentProps } from 'react';
import type { CartItem } from '#/types/cart.type';

type Props = ComponentProps<'div'> & {
  cartItems: CartItem[];
  loading?: boolean;
  onAdd?: (cartItem: CartItem) => Promise<number>;
  onSubtract?: (cartItem: CartItem) => Promise<number>;
  onRemove?: (gameProductId: number) => Promise<boolean>;
  onEmpty?: () => Promise<boolean>;
};

const COL_TITLE_CLASSNAME = 'text-sm';

const simpleBarProps = {
  className: 'h-[468px] px-4 pb-4 overflow-x-hidden',
  classNames: { contentWrapper: 'w-fit' },
};

const itemAnimate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, height: 0 },
};

const CartList = memo(function CartList({
  cartItems,
  loading,
  onAdd,
  onSubtract,
  onRemove,
  onEmpty,
  ...moreProps
}: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null | undefined>(
    undefined,
  );

  const itemNameToRemove = useMemo(
    () =>
      itemToRemove === null
        ? 'all items'
        : itemToRemove?.gameProduct?.games[0].name,
    [itemToRemove],
  );

  const handleSubtract = useCallback(
    (cartItem: CartItem) => {
      const SUBTRACT_AMOUNT = 1;
      const quantity = cartItem.quantity - SUBTRACT_AMOUNT;
      if (quantity >= SUBTRACT_AMOUNT) {
        onSubtract && onSubtract({ ...cartItem, quantity: SUBTRACT_AMOUNT });
      } else {
        setItemToRemove(cartItem);
        setOpenConfirm(true);
      }
    },
    [onSubtract],
  );

  const handleRemove = useCallback(
    (gameProductId: number) => {
      const target =
        cartItems.find((item) => item.gameProductId === gameProductId) || null;
      setItemToRemove(target);
      setOpenConfirm(true);
    },
    [cartItems],
  );

  const handleEmpty = useCallback(() => {
    setItemToRemove(null);
    setOpenConfirm(true);
  }, []);

  const handleRemoveConfirm = useCallback(async () => {
    if (itemToRemove === undefined) {
      return;
    }

    setOpenConfirm(false);

    itemToRemove === null
      ? onEmpty && (await onEmpty())
      : onRemove && (await onRemove(Number(itemToRemove.gameProductId)));

    setItemToRemove(undefined);
  }, [itemToRemove, onRemove, onEmpty]);

  return (
    <>
      <div {...moreProps}>
        <div className='flex flex-col justify-between items-center'>
          <div>
            <div className='px-4 flex justify-start items-end'>
              <div className='w-12' />
              <div className='mr-4 w-[260px]'>
                <BaseFieldTitle className={COL_TITLE_CLASSNAME}>
                  Game
                </BaseFieldTitle>
              </div>
              <div className='mr-4 min-w-[100px] text-end'>
                <BaseFieldTitle className={COL_TITLE_CLASSNAME}>
                  Price
                </BaseFieldTitle>
              </div>
              <div className='ml-2 mr-4 w-6' />
              <div className='mr-4 min-w-[104px] text-center'>
                <BaseFieldTitle className={COL_TITLE_CLASSNAME}>
                  Quantity
                </BaseFieldTitle>
              </div>
              <div className='flex-1 text-end'>
                <BaseFieldTitle className={COL_TITLE_CLASSNAME}>
                  Total
                </BaseFieldTitle>
              </div>
            </div>
            <SimpleBar {...simpleBarProps}>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.gameProductId}
                    className='border-b border-current-dark/10 last:border-b-0 overflow-hidden'
                    {...itemAnimate}
                  >
                    <CartItemCard
                      className='min-w-[720px] py-4'
                      item={item}
                      loading={loading}
                      onAdd={onAdd}
                      onSubtract={handleSubtract}
                      onRemove={handleRemove}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SimpleBar>
          </div>
          <div className='pl-4 w-full'>
            <BaseButton
              disabled={loading || !cartItems.length}
              variant='outlined'
              onClick={handleEmpty}
              fullWidth
            >
              Empty Cart
            </BaseButton>
          </div>
        </div>
      </div>
      <Dialog
        className='bg-transparent overflow-hidden'
        size='xs'
        open={openConfirm}
        handler={() => setOpenConfirm(!openConfirm)}
      >
        <BaseSurface className='p-4'>
          <div className='mt-4 mb-8 flex justify-center items-center w-full'>
            <BaseIcon
              name='warning-diamond'
              className='fill-current-dark'
              width={28}
              height={28}
            />
            <BaseTypography className='ml-2'>
              Remove {itemNameToRemove}?
            </BaseTypography>
          </div>
          <div className='flex items-center justify-between'>
            <BaseButton variant='text' onClick={() => setOpenConfirm(false)}>
              Cancel
            </BaseButton>
            <BaseButton onClick={handleRemoveConfirm}>Confirm</BaseButton>
          </div>
        </BaseSurface>
      </Dialog>
    </>
  );
});

export default CartList;
