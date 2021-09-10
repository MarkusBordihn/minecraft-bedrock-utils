/**
 * @fileoverview Minecraft Bedrock Utils - Enquirer lib
 *
 * @license Copyright 2021 Markus Bordihn
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const spaceBarHint = ' (toggle with space)';

const formatBoolean = (input, choice, scope) => {
  choice.input = '';
  choice.cursor = 0;
  const { noop, success, dark } = scope.styles;
  const check = () =>
    choice.enabled
      ? success('true') + '\t' + dark(spaceBarHint)
      : noop('false') + '\t' + dark(spaceBarHint);
  if (input !== ' ') {
    scope.alert();
    return check();
  }
  choice.enabled = !choice.enabled;
  return check();
};

const formatOptional = (input, choice, scope) => {
  choice.input = '';
  choice.cursor = 0;
  const { noop, success, dark } = scope.styles;
  const check = () =>
    choice.enabled
      ? success('true') + ' 🏷️\t ' + dark(spaceBarHint)
      : noop('false') + ' 🏷️\t ' + dark(spaceBarHint);
  if (input !== ' ') {
    scope.alert();
    return check();
  }
  choice.enabled = !choice.enabled;
  return check();
};

exports.formatBoolean = formatBoolean;
exports.formatOptional = formatOptional;
