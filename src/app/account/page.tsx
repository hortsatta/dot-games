'use client';

import { useAddress } from '#/hooks/use-address.hook';
import { useCurrentUserAccount } from '#/hooks/use-current-user-account.hook';
import BaseSpinner from '#/components/base/base-spinner.component';
import BaseScene from '#/components/base/base-scene.component';
import BaseSceneTitle from '#/components/base/base-scene-title.component';
import UserAccountAvatarSelector from '#/components/user-account/user-account-avatar-selector.component';
import UserAccountUpdateForm from '#/components/user-account/user-account-update-form.component';
import UserAccountAddressList from '#/components/user-account/user-account-address-list.component';

const AccountPage = () => {
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

  return (
    <BaseScene
      className='max-w-compact mx-auto w-full'
      loading={userAccountInitalLoading}
    >
      {!!currentUserAccount && (
        <div className='py-8'>
          <div className='pb-8'>
            <BaseSceneTitle>User Account</BaseSceneTitle>
            <div className='flex items-center'>
              <UserAccountAvatarSelector
                className='mr-4'
                userAccount={currentUserAccount}
              />
              <UserAccountUpdateForm userAccount={currentUserAccount} />
            </div>
          </div>
          <div>
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
        </div>
      )}
    </BaseScene>
  );
};

export default AccountPage;
