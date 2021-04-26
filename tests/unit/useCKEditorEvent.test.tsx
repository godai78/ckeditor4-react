import { renderHook } from '@testing-library/react-hooks/dom';
import { createDivRef } from './utils';
import { useCKEditor, useCKEditorEvent } from '../../src';

function init() {
	describe( 'useCKEditorEvent', () => {
		/**
		 * Registers an event handler, then removes it when a new one is provided.
		 */
		it( 'controls lifecycle of a handler', async () => {
			const ref = createDivRef();
			const onReadOnly1 = jasmine.createSpy( 'onReadOnly1' );
			const onReadOnly2 = jasmine.createSpy( 'onReadOnly2' );
			const { result: ckEditorResult, waitForValueToChange } = renderHook(
				() =>
					useCKEditor( {
						element: ref.current
					} )
			);
			const { rerender } = renderHook( ( props: any ) =>
				useCKEditorEvent( {
					handler: onReadOnly1,
					evtName: 'readOnly',
					editor: ckEditorResult.current.editor,
					...props
				} )
			);
			await waitForValueToChange(
				() => ckEditorResult.current.status === 'ready'
			);
			rerender( { editor: ckEditorResult.current.editor } );
			ckEditorResult.current.editor.setReadOnly( true );
			expect( onReadOnly1 ).toHaveBeenCalledTimes( 1 );
			rerender( { handler: onReadOnly2 } );
			ckEditorResult.current.editor.setReadOnly( false );
			expect( onReadOnly1 ).toHaveBeenCalledTimes( 1 );
			expect( onReadOnly2 ).toHaveBeenCalledTimes( 1 );
		} );

		/**
		 * Unregisters event handler on unmount.
		 */
		it( 'unregisters handler on unmount', async () => {
			const ref = createDivRef();
			const onReadOnly = jasmine.createSpy( 'onReadOnly' );
			const { result: ckEditorResult, waitForValueToChange } = renderHook(
				() =>
					useCKEditor( {
						element: ref.current
					} )
			);
			const { rerender, unmount } = renderHook( ( props: any ) =>
				useCKEditorEvent( {
					handler: onReadOnly,
					evtName: 'readOnly',
					editor: ckEditorResult.current.editor,
					...props
				} )
			);
			await waitForValueToChange(
				() => ckEditorResult.current.status === 'ready'
			);
			rerender( { editor: ckEditorResult.current.editor } );
			ckEditorResult.current.editor.setReadOnly( true );
			expect( onReadOnly ).toHaveBeenCalledTimes( 1 );
			unmount();
			ckEditorResult.current.editor.setReadOnly( false );
			expect( onReadOnly ).toHaveBeenCalledTimes( 1 );
		} );
	} );
}

export default init;
