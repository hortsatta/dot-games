'use client';

import { useCallback } from 'react';

import { useOrders } from '#/hooks/use-order.hook';
import { useBoundStore } from '#/hooks/use-store.hook';
import { useAddress } from '#/hooks/use-address.hook';
import { useCurrentUserAccount } from '#/hooks/use-current-user-account.hook';
import BaseSpinner from '#/components/base/base-spinner.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseSceneTitle from '#/components/base/base-scene-title.component';
import AuthSignInCard from '#/components/auth/auth-sign-in-card.component';
import UserAccountAvatarSelector from '#/components/user-account/user-account-avatar-selector.component';
import UserAccountUpdateForm from '#/components/user-account/user-account-update-form.component';
import UserAccountAddressList from '#/components/user-account/user-account-address-list.component';
import OrderList from '#/components/order/order-list.component';

const AccountPage = () => {
  const setShowLogin = useBoundStore((state) => state.setShowLogin);

  const { initialLoading: userAccountInitalLoading, currentUserAccount } =
    useCurrentUserAccount();

  const {
    initialLoading: addressInitialLoading,
    loading,
    addresses,
    countries,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  } = useAddress();

  const { initialLoading: ordersInitialLoading, orders } = useOrders();

  const handleSignIn = useCallback(() => {
    setShowLogin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseScene
      className='max-w-compact mx-auto w-full'
      loading={userAccountInitalLoading}
    >
      {!currentUserAccount ? (
        <AuthSignInCard
          className='p-8 pt-16'
          labelAppend='to view your wish list'
          onSignIn={handleSignIn}
        />
      ) : (
        <div className='py-8'>
          <div className='pb-8'>
            <BaseSceneTitle className='mb-3'>User Account</BaseSceneTitle>
            <div className='flex items-center'>
              <UserAccountAvatarSelector
                className='mr-4'
                userAccount={currentUserAccount}
              />
              <UserAccountUpdateForm userAccount={currentUserAccount} />
            </div>
          </div>
          <div className='pb-4'>
            <BaseSceneTitle className='mb-3'>Address List</BaseSceneTitle>
            {addressInitialLoading ? (
              <div className='w-full flex justify-center'>
                <BaseSpinner className='my-4 w-10 h-10' />
              </div>
            ) : (
              <UserAccountAddressList
                countries={countries || []}
                addresses={addresses || []}
                userAccount={currentUserAccount}
                disabled={loading}
                onAddAddress={addAddress}
                onUpdateAddress={updateAddress}
                onRemoveAddress={removeAddress}
                onSetDefaultAddress={setDefaultAddress}
              />
            )}
          </div>
          <div>
            <BaseSceneTitle className='mb-3'>Your Orders</BaseSceneTitle>
            {ordersInitialLoading ? (
              <div className='w-full flex justify-center'>
                <BaseSpinner className='my-4 w-10 h-10' />
              </div>
            ) : (
              <OrderList orders={orders} />
            )}
          </div>
        </div>
      )}
    </BaseScene>
  );
};

export default AccountPage;
