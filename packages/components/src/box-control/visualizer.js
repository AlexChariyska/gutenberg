/**
 * WordPress dependencies
 */
import { useRef, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	Container,
	TopView,
	RightView,
	BottomView,
	LeftView
} from './styles/box-control-visualizer-styles';
import { DEFAULT_VALUES, DEFAULT_VISUALIZER_VALUES } from './utils';

export default function BoxControlVisualizer( {
	children,
	showValues = DEFAULT_VISUALIZER_VALUES,
	values: valuesProp = DEFAULT_VALUES,
	type,
	...props
} ) {
	const isPositionAbsolute = ! children;
	return (
		<Container
			{ ...props }
			isPositionAbsolute={ isPositionAbsolute }
			aria-hidden="true"
		>
			<Sides
				showValues={ showValues }
				values={ valuesProp }
				type={ type }
			/>
			{ children }
		</Container>
	);
}

function Sides( { showValues = DEFAULT_VISUALIZER_VALUES, values, type } ) {
	const { top, right, bottom, left } = values;

	return (
		<>
			<Top isVisible={ showValues.top } value={ top } type={ type } />
			<Right isVisible={ showValues.right } value={ right } />
			<Bottom
				isVisible={ showValues.bottom }
				value={ bottom }
				type={ type }
			/>
			<Left isVisible={ showValues.left } value={ left } />
		</>
	);
}

function Top( { isVisible = false, value, type } ) {
	const height = value;
	const animationProps = useSideAnimation( height );
	const isActive = animationProps.isActive || isVisible;
	return (
		<TopView
			isActive={ isActive }
			style={ { height } }
			transform={ type ? '-100%' : null }
		/>
	);
}

function Right( { isVisible = false, value } ) {
	const width = value;
	const animationProps = useSideAnimation( width );
	const isActive = animationProps.isActive || isVisible;

	return <RightView isActive={ isActive } style={ { width } } />;
}

function Bottom( { isVisible = false, value, type } ) {
	const height = value;
	const animationProps = useSideAnimation( height );
	const isActive = animationProps.isActive || isVisible;
	return (
		<BottomView
			isActive={ isActive }
			style={ { height } }
			transform={ type ? '100%' : null }
		/>
	);
}

function Left( { isVisible = false, value } ) {
	const width = value;
	const animationProps = useSideAnimation( width );
	const isActive = animationProps.isActive || isVisible;

	return <LeftView isActive={ isActive } style={ { width } } />;
}

/**
 * Custom hook that renders the "flash" animation whenever the value changes.
 *
 * @param {string} value Value of (box) side.
 */
function useSideAnimation( value ) {
	const [ isActive, setIsActive ] = useState( false );
	const valueRef = useRef( value );
	const timeoutRef = useRef();

	const clearTimer = () => {
		if ( timeoutRef.current ) {
			window.clearTimeout( timeoutRef.current );
		}
	};

	useEffect( () => {
		if ( value !== valueRef.current ) {
			setIsActive( true );
			valueRef.current = value;

			clearTimer();

			timeoutRef.current = setTimeout( () => {
				setIsActive( false );
			}, 400 );
		}

		return () => clearTimer();
	}, [ value ] );

	return {
		isActive,
	};
}
