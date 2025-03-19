import cx from "classnames";
import type { MouseEvent } from "react";
import { forwardRef, useCallback, useMemo } from "react";
import { t } from "ttag";

import CS from "metabase/css/core/index.css";
import DashboardS from "metabase/css/dashboard.module.css";
import EmbedFrameS from "metabase/public/components/EmbedFrame/EmbedFrame.module.css";
import { Icon } from "metabase/ui";
import { HARD_ROW_LIMIT } from "metabase-lib/v1/queries/utils";

import {
  ObjectDetailFooterRoot,
  PaginationButton,
  PaginationMessage,
} from "./ObjectDetailFooter.styled";

interface ObjectDetailFooterProps {
  className?: string;
  "data-testid"?: string;
  start: number;
  end: number;
  total: number;
  limit?: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  singleItem?: boolean;
}

export const ObjectDetailFooter = forwardRef<
  HTMLDivElement,
  ObjectDetailFooterProps
>(function ObjectDetailFooter(
  {
    className,
    "data-testid": dataTestId = "ObjectDetailFooter",
    start,
    end,
    limit,
    total,
    onPreviousPage,
    onNextPage,
    singleItem,
  }: ObjectDetailFooterProps,
  ref,
) {
  const paginateMessage = useMemo(() => {
    const isOverLimit = limit === undefined && total >= HARD_ROW_LIMIT;

    if (singleItem) {
      return isOverLimit
        ? t`Item ${start + 1} of first ${total}`
        : t`Item ${start + 1} of ${total}`;
    }

    return isOverLimit
      ? t`Rows ${start + 1}-${end + 1} of first ${total}`
      : t`Rows ${start + 1}-${end + 1} of ${total}`;
  }, [total, start, end, limit, singleItem]);

  const handlePreviousPage = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      onPreviousPage();
    },
    [onPreviousPage],
  );

  const handleNextPage = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      onNextPage();
    },
    [onNextPage],
  );

  return (
    <ObjectDetailFooterRoot
      className={cx(
        className,
        DashboardS.fullscreenNormalText,
        DashboardS.fullscreenNightText,
        EmbedFrameS.fullscreenNightText,
      )}
      data-testid={dataTestId}
      ref={ref}
    >
      <PaginationMessage>{paginateMessage}</PaginationMessage>
      <PaginationButton
        className={CS.textPrimary}
        aria-label={t`Previous page`}
        direction="previous"
        onClick={handlePreviousPage}
        disabled={start === 0}
      >
        <Icon name="chevronleft" />
      </PaginationButton>
      <PaginationButton
        className={CS.textPrimary}
        aria-label={t`Next page`}
        direction="next"
        onClick={handleNextPage}
        disabled={end + 1 >= total}
      >
        <Icon name="chevronright" />
      </PaginationButton>
    </ObjectDetailFooterRoot>
  );
});
