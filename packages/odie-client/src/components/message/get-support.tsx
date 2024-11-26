import { __ } from '@wordpress/i18n';
import { useNavigate } from 'react-router-dom';
import { useOdieAssistantContext } from '../../context';
import { useCreateZendeskConversation } from '../../hooks';
import './get-support.scss';

interface GetSupportProps {
	onClickAdditionalEvent?: () => void;
	isUserEligibleForPaidSupport?: boolean;
}

interface ButtonConfig {
	text: string;
	action: () => Promise< void >;
}

export const GetSupport: React.FC< GetSupportProps > = ( {
	onClickAdditionalEvent,
	isUserEligibleForPaidSupport,
} ) => {
	const navigate = useNavigate();
	const newConversation = useCreateZendeskConversation();
	const { chat, isUserEligibleForPaidSupport: contextIsUserEligibleForPaidSupport } =
		useOdieAssistantContext();

	// Early return if user is already talking to a human
	if ( chat.provider !== 'odie' ) {
		return null;
	}

	const getButtonConfig = (): ButtonConfig => {
		if ( isUserEligibleForPaidSupport || contextIsUserEligibleForPaidSupport ) {
			return {
				text: __( 'Get instant support', __i18n_text_domain__ ),
				action: async () => {
					onClickAdditionalEvent?.();
					await newConversation();
				},
			};
		}

		return {
			text: __( 'Ask in our forums', __i18n_text_domain__ ),
			action: async () => {
				onClickAdditionalEvent?.();
				navigate( '/contact-form?mode=FORUM' );
			},
		};
	};

	const buttonConfig = getButtonConfig();

	const handleClick = async ( event: React.MouseEvent< HTMLButtonElement > ) => {
		event.preventDefault();
		await buttonConfig.action();
	};

	return (
		<div className="odie__transfer-chat">
			<button onClick={ handleClick }>{ buttonConfig.text }</button>
		</div>
	);
};
