// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @channel

describe('Archive channel header spec', () => {
    before(() => {
        cy.apiAdminLogin();
        cy.visitAndWait('/admin_console/user_management/permissions/system_scheme');

        // # Click reset to defaults and confirm
        cy.findByTestId('resetPermissionsToDefault').click();
        cy.get('#confirmModalButton').click();

        // # Ensure permissions for converting channel to private is enabled
        cy.findByTestId('all_users-public_channel-convert_public_channel_to_private-checkbox').then((el) => {
            if (!el.hasClass('checked')) {
                el.click();
            }
        });

        // # Save the settings
        cy.get('#saveSetting').click();
        cy.waitUntil(() => cy.get('#saveSetting').then((el) => {
            return el[0].innerText === 'Save';
        }));

        cy.apiUpdateConfig({
            TeamSettings: {
                ExperimentalViewArchivedChannels: true,
            },
        });

        // # Login as test user and visit create channel
        cy.apiInitSetup({loginAfter: true}).then(({team, channel}) => {
            cy.visitAndWait(`/${team.name}/channels/${channel.name}`);
        });
    });

    it('MM-T1717 Archived channel details cannot be edited', () => {
        // # click on channel drop-down menu
        cy.get('#channelHeaderTitle').click();

        // * The dropdown menu of the channel header should be visible;
        cy.get('#channelLeaveChannel').should('be.visible');

        // * Rename menu option should be visible;
        cy.get('#channelRename').should('be.visible');

        // * Edit header menu option should be visible;
        cy.get('#channelEditHeader').should('be.visible');

        // * Edit purpose menu option should be visible;
        cy.get('#channelEditPurpose').should('be.visible');

        // * Convert channel to private menu option should be visible;
        cy.get('#channelConvertToPrivate').should('be.visible');

        // * Archive channel menu option should be visible;
        cy.get('#channelArchiveChannel').should('be.visible');

        // * Add members menu option should be visible;
        cy.get('#channelAddMembers').should('be.visible');

        // * Notification preferences option should be visible;
        cy.get('#channelNotificationPreferences').should('be.visible');

        // # Close the channel dropdown menu
        cy.get('#channelHeaderTitle').click();

        // # Archive the channel
        cy.uiArchiveChannel();

        // * Rename menu option should not be visible;
        cy.get('#channelRename').should('be.not.visible');

        // * Edit header menu option should not be visible;
        cy.get('#channelEditHeader').should('be.not.visible');

        // * Edit purpose menu option should not be visible;
        cy.get('#channelEditPurpose').should('be.not.visible');

        // * Convert channel to private menu option should not be visible;
        cy.get('#channelConvertToPrivate').should('be.not.visible');

        // * Archive channel menu option should not be visible;
        cy.get('#channelArchiveChannel').should('be.not.visible');

        // * Add members menu option should not be visible;
        cy.get('#channelAddMembers').should('be.not.visible');

        // * Notification preferences option should not be visible;
        cy.get('#channelNotificationPreferences').should('be.not.visible');

        // # Close the channel dropdown menu
        cy.get('#channelHeaderTitle').click();
    });
});
