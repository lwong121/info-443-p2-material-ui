import * as React from 'react';
import { unstable_useId as useId, unstable_useForkRef as useForkRef } from '@mui/utils';
import { EventHandlers } from '../utils/types';
import useButton from '../useButton';
import {
  MenuItemMetadata,
  UseMenuItemParameters,
  UseMenuItemReturnValue,
  UseMenuItemRootSlotProps,
} from './useMenuItem.types';
import { useListItem } from '../useList';
import { useCompoundItem } from '../utils/useCompoundItem';

function idGenerator(existingKeys: Set<string>) {
  return `menu-item-${existingKeys.size}`;
}

/**
 *
 * Demos:
 *
 * - [Menu](https://mui.com/base/react-menu/#hooks)
 *
 * API:
 *
 * - [useMenuItem API](https://mui.com/base/react-menu/hooks-api/#use-menu-item)
 */
export default function useMenuItem(params: UseMenuItemParameters): UseMenuItemReturnValue {
  const { disabled = false, id: idParam, rootRef: externalRef, label } = params;

  const id = useId(idParam);
  const itemRef = React.useRef<HTMLElement>(null);

  const itemMetadata: MenuItemMetadata = React.useMemo(
    () => ({ disabled, id: id ?? '', label, ref: itemRef }),
    [disabled, id, label],
  );

  const {
    getRootProps: getListRootProps,
    highlighted,
    rootRef: listItemRefHandler,
  } = useListItem({
    item: id,
  });

  const { index, totalItemCount } = useCompoundItem(id ?? idGenerator, itemMetadata);

  const {
    getRootProps: getButtonProps,
    focusVisible,
    rootRef: buttonRefHandler,
  } = useButton({
    disabled,
    focusableWhenDisabled: true,
  });

  const handleRef = useForkRef(listItemRefHandler, buttonRefHandler, externalRef, itemRef);

  React.useDebugValue({ id, highlighted, disabled, label });

  // If `id` is undefined (during SSR in React < 18), we fall back to rendering a simplified menu item
  // which does not have access to infortmation about its position or highlighted state.
  if (id === undefined) {
    return {
      getRootProps: <TOther extends EventHandlers = {}>(
        otherHandlers: TOther = {} as TOther,
      ): UseMenuItemRootSlotProps<TOther> => ({
        ...otherHandlers,
        ...getButtonProps(otherHandlers),
        role: 'menuitem',
      }),
      disabled: false,
      focusVisible,
      highlighted: false,
      index: -1,
      totalItemCount: 0,
      rootRef: handleRef,
    };
  }

  const getRootProps = <TOther extends EventHandlers = {}>(
    otherHandlers: TOther = {} as TOther,
  ): UseMenuItemRootSlotProps<TOther> => {
    const resolvedButtonProps = {
      ...otherHandlers,
      ...getButtonProps(otherHandlers),
    };

    const resolvedMenuItemProps = {
      ...resolvedButtonProps,
      ...getListRootProps(resolvedButtonProps),
    };

    return {
      ...otherHandlers,
      ...resolvedButtonProps,
      ...resolvedMenuItemProps,
      role: 'menuitem',
      ref: handleRef,
    };
  };

  return {
    getRootProps,
    disabled,
    focusVisible,
    highlighted,
    index,
    totalItemCount,
    rootRef: handleRef,
  };
}
