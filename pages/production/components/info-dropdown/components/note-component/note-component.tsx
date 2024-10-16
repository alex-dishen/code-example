import { NoteIcon } from 'icons/note';
import { connect } from 'react-redux';
import { InfoIcon } from 'icons/info';
import { AppState } from 'redux/store';
import { TextareaAutosize, Tooltip } from '@mui/material';
import { FC, useState, RefObject, useEffect } from 'react';
import Skeleton from 'components/ui-new/skeleton/skeleton';
import InputButtons from 'components/input-buttons/input-buttons';
import { Page } from 'pages/production/controllers/production-list-controller/types';
import { EditNoteActions, MAX_LETTERS, EditNoteArgs } from 'pages/production/controllers/edit-note.controller';
import s from './note-component.module.scss';

const skeleton = (
  <div className={s.skeleton}>
    <Skeleton className={s.skeleton_big} variant="rectangular" />
  </div>
);
const skeletonSmall = (
  <div className={s.skeleton}>
    <Skeleton className={s.skeleton_small} variant="rectangular" />
  </div>
);

type OwnProps = {
  page: Page;
  value: string;
  isFetching?: boolean;
  productionId: string;
  textareaRef?: RefObject<HTMLTextAreaElement>;
};
type StateProps = {
  note: string;
  isLoading: boolean;
};
type DispatchProps = {
  dispose: () => void;
  saveChanges: (page: Page) => void;
  onChange: (value: string) => void;
  onChangeNoteMode: (value: boolean) => void;
  init: ({ productionId }: EditNoteArgs) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const NoteComponent: FC<Props> = ({
  page,
  value,
  note = '',
  isLoading,
  isFetching,
  textareaRef,
  productionId,
  init,
  dispose,
  onChange,
  saveChanges,
  onChangeNoteMode,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (productionId) init({ productionId, initialNote: value });
    return () => {
      dispose();
    };
  }, [productionId, value]);

  const handleConfirm = async () => {
    await saveChanges(page);
    onChangeNoteMode(false);
    setIsEditMode(false);
  };

  const handleOnBlur = async () => {
    if (!isLoading) {
      onChangeNoteMode(false);
      setIsEditMode(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.heading}>
        <div className={s.heading_text}>
          <NoteIcon />
          <p>Note</p>
          <Tooltip
            title="Leaving note directly in the 'Add notes' field doesn't impact changes in 'Configuration'"
            placement="top"
          >
            <span className={s.icon_wrapper}>
              <InfoIcon width={16} height={16} stroke="#437bff" />
            </span>
          </Tooltip>
        </div>
        <div className={s.counter}>
          {isFetching ? (
            skeletonSmall
          ) : (
            <>
              {note.length}/{MAX_LETTERS}
            </>
          )}
        </div>
      </div>
      {isFetching ? (
        skeleton
      ) : (
        <div className={s.textarea_container}>
          <TextareaAutosize
            value={note}
            color="primary"
            ref={textareaRef}
            onBlur={handleOnBlur}
            className={s.textarea}
            placeholder="Add notes"
            onFocus={() => setIsEditMode(true)}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className={s.actions} data-is-show={isEditMode}>
            <InputButtons isLoading={isLoading} onConfirmMouseDown={handleConfirm} onCancelClick={() => setIsEditMode(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  note: state.production.editNote.note,
  isLoading: state.production.editNote.isLoading,
});
const mapDispatchToProps: DispatchProps = {
  init: EditNoteActions.init,
  dispose: EditNoteActions.dispose,
  onChange: EditNoteActions.onChange,
  saveChanges: EditNoteActions.saveChanges,
  onChangeNoteMode: EditNoteActions.onChangeNoteMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(NoteComponent);
