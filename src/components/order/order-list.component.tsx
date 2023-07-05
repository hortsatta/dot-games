import { memo } from 'react';
import { Chip } from '@material-tailwind/react';
import dayjs from 'dayjs';
import cx from 'classix';

import BaseTypography from '../base/base-typography.component';
import BaseIcon from '../base/base-icon.component';
import BaseFieldTitle from '../base/base-field-title.component';

import type { ComponentProps } from 'react';
import type { OrderSummary } from '#/types/order.type';

type Props = ComponentProps<'div'> & {
  orders: OrderSummary[];
};

const TABLE_HEAD = [
  { label: 'Order No.' },
  { label: 'Date' },
  { label: 'Item Count', className: 'text-end' },
  { label: 'Total Amount', className: 'text-end' },
  { label: 'Status' },
];

const OrderList = memo(function OrderList({
  className,
  orders,
  ...moreProps
}: Props) {
  return (
    <>
      <div className={cx('max-w-[800px]', className)} {...moreProps}>
        {!orders.length ? (
          <div className='py-4'>
            <div className='flex flex-col items-center w-fit'>
              <BaseIcon
                name='selection-slash'
                className='mb-4 fill-current-dark/50'
                width={36}
                height={36}
              />
              <span className='dark:text-current-dark/50'>
                No orders yet! There is nothing to show.
              </span>
            </div>
          </div>
        ) : (
          <div>
            <table className='w-full min-w-max table-auto text-left bg-surface rounded-xl max-h-[500px]'>
              <thead>
                <tr>
                  {TABLE_HEAD.map(({ label, className }) => (
                    <th key={label} className={cx('px-6 pt-4', className)}>
                      <BaseFieldTitle className='text-sm'>
                        {label}
                      </BaseFieldTitle>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(
                  ({ id, date, itemCount, totalAmount, status }, index) => {
                    const isLast = index === orders.length - 1;
                    const className = isLast
                      ? 'py-4 px-6'
                      : 'py-4 px-6 border-b border-current-dark/10';

                    return (
                      <tr key={id}>
                        <td className={className}>
                          <BaseTypography variant='small'>
                            {id.toString().padStart(11, '0')}
                          </BaseTypography>
                        </td>
                        <td className={className}>
                          <BaseTypography variant='small'>
                            {dayjs(date).format('YYYY-MM-DD')}
                          </BaseTypography>
                        </td>
                        <td className={cx(className, 'text-end')}>
                          <BaseTypography variant='small'>
                            {itemCount}
                          </BaseTypography>
                        </td>
                        <td className={cx(className, 'text-end')}>
                          <BaseTypography variant='small'>
                            ${totalAmount.toFixed(2)}
                          </BaseTypography>
                        </td>
                        <td className={className}>
                          {status === 1 ? (
                            <Chip
                              className='pt-2 w-fit rounded-md'
                              color='green'
                              value='Paid'
                            />
                          ) : (
                            <Chip
                              className='pt-2 w-fit rounded-md'
                              color='amber'
                              value='Pending'
                            />
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
});

export default OrderList;
