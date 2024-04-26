/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import vOutsideEvents from 'vue-outside-events'
import VueRouter from 'vue-router'
import VueShortKey from 'vue-shortkey'
import Vuex from 'vuex'

import { getRequestToken } from '@nextcloud/auth'
import { translate, translatePlural } from '@nextcloud/l10n'
import { generateFilePath } from '@nextcloud/router'

import { options as TooltipOptions } from '@nextcloud/vue/dist/Directives/Tooltip.js'

import Recording from './Recording.vue'

import router from './router/router.js'
import store from './store/index.js'
import {
	signalingGetSettingsForRecording,
	signalingJoinCallForRecording,
	signalingKill,
} from './utils/webrtc/index.js'

import '@nextcloud/dialogs/style.css'
// Leaflet icon patch
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package

// eslint-disable-next-line
import 'leaflet-defaulticon-compatibility'

// CSP config for webpack dynamic chunk loading
// eslint-disable-next-line
__webpack_nonce__ = btoa(getRequestToken())

// Correct the root of the app for chunk loading
// OC.linkTo matches the apps folders
// OC.generateUrl ensure the index.php (or not)
// We do not want the index.php since we're loading files
// eslint-disable-next-line
__webpack_public_path__ = generateFilePath('spreed', '', 'js/')

Vue.prototype.t = translate
Vue.prototype.n = translatePlural
Vue.prototype.OC = OC
Vue.prototype.OCA = OCA

Vue.use(PiniaVuePlugin)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueObserveVisibility)
Vue.use(VueShortKey, { prevent: ['input', 'textarea', 'div'] })
Vue.use(vOutsideEvents)

const pinia = createPinia()

TooltipOptions.container = '#call-container'
store.dispatch('setMainContainerSelector', '#call-container')

window.store = store

if (!window.OCA.Talk) {
	window.OCA.Talk = {}
}

const instance = new Vue({
	el: '#content',
	store,
	pinia,
	router,
	render: h => h(Recording),
})

// make the instance available to global components that might run on the same page
OCA.Talk.instance = instance

// Expose functions to be called by the recording server
OCA.Talk.signalingGetSettingsForRecording = signalingGetSettingsForRecording
OCA.Talk.signalingJoinCallForRecording = signalingJoinCallForRecording
OCA.Talk.signalingKill = signalingKill

export default instance
