/* eslint "react/prop-types": "warn" */
import cx from "classnames";
import { getIn } from "icepick";
import PropTypes from "prop-types";
import { memo } from "react";
import { Link } from "react-router";
import { P, match } from "ts-pattern";
import { t } from "ttag";

import S from "metabase/components/List/List.module.css";
import Select from "metabase/core/components/Select";
import CS from "metabase/css/core/index.css";
import {
  FIELD_SEMANTIC_TYPES,
  FIELD_SEMANTIC_TYPES_MAP,
} from "metabase/lib/core";
import { Icon } from "metabase/ui";
import { isTypeFK } from "metabase-lib/v1/types/utils/isa";

import F from "./Field.module.css";

const Field = ({ field, foreignKeys, url, icon, isEditing, formField }) => (
  <div className={cx(S.item, CS.py1, CS.borderTop)}>
    <div
      className={cx(S.itemBody, CS.flexColumn)}
      style={{ maxWidth: "100%", borderTop: "none" }}
    >
      <div className={F.field} style={{ flexGrow: "1" }}>
        <div className={cx(S.itemTitle, F.fieldName)}>
          {isEditing ? (
            <input
              className={F.fieldTextInput}
              type="text"
              placeholder={field.name}
              {...formField.display_name}
              defaultValue={field.display_name}
            />
          ) : (
            <div>
              <Link to={url}>
                <span className={CS.textBrand}>{field.display_name}</span>
                <span className={cx(F.fieldActualName, CS.ml2)}>
                  {field.name}
                </span>
              </Link>
            </div>
          )}
        </div>
        <div className={F.fieldType}>
          {isEditing ? (
            <Select
              name={formField.semantic_type.name}
              placeholder={t`Select a field type`}
              value={
                formField.semantic_type.value !== undefined
                  ? formField.semantic_type.value
                  : field.semantic_type
              }
              onChange={formField.semantic_type.onChange}
              options={FIELD_SEMANTIC_TYPES.concat({
                id: null,
                name: t`No field type`,
                section: t`Other`,
              })}
              optionValueFn={o => o.id}
              optionSectionFn={o => o.section}
            />
          ) : (
            <div className={cx(CS.flex, CS.alignCenter)}>
              <div className={S.leftIcons}>
                {icon && <Icon className={S.chartIcon} name={icon} size={20} />}
              </div>
              <span
                className={
                  getIn(FIELD_SEMANTIC_TYPES_MAP, [field.semantic_type, "name"])
                    ? CS.textMedium
                    : CS.textLight
                }
              >
                {getIn(FIELD_SEMANTIC_TYPES_MAP, [
                  field.semantic_type,
                  "name",
                ]) || t`No field type`}
              </span>
            </div>
          )}
        </div>
        <div className={F.fieldDataType}>{field.base_type}</div>
      </div>
      <div className={S.itemSubtitle}>
        <div className={F.fieldForeignKey}>
          {isEditing
            ? (isTypeFK(formField.semantic_type.value) ||
                (isTypeFK(field.semantic_type) &&
                  formField.semantic_type.value === undefined)) && (
                <Select
                  className={CS.mt1}
                  name={formField.fk_target_field_id.name}
                  placeholder={t`Select a target`}
                  value={
                    formField.fk_target_field_id.value ||
                    field.fk_target_field_id
                  }
                  onChange={formField.fk_target_field_id.onChange}
                  options={Object.values(foreignKeys)}
                  optionValueFn={o => o.id}
                />
              )
            : isTypeFK(field.semantic_type) && (
                <span className={CS.mt1}>
                  {getIn(foreignKeys, [field.fk_target_field_id, "name"])}
                </span>
              )}
        </div>

        {match({ description: field.description, isEditing })
          .with({ isEditing: true }, () => {
            return (
              <input
                className={cx(F.fieldTextInput, CS.mb2, CS.mt1)}
                type="text"
                placeholder={t`No column description yet`}
                {...formField.description}
                defaultValue={field.description ?? ""}
              />
            );
          })
          .with({ description: P.not(P.nullish) }, () => (
            <div className={cx(F.fieldDescription, CS.mb2, CS.mt1)}>
              {field.description}
            </div>
          ))
          .otherwise(() => null)}
      </div>
    </div>
  </div>
);
Field.propTypes = {
  field: PropTypes.object.isRequired,
  foreignKeys: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  isEditing: PropTypes.bool,
  formField: PropTypes.object,
};

export default memo(Field);
