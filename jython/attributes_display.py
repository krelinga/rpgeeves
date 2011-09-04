# Copyright 2011 Andrew Kreling
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from attributes import Attribute

from javax.swing import JButton, JFrame

import time

if __name__ == "__main__":
  frame = JFrame("Hello Attribute!", defaultCloseOperation=JFrame.EXIT_ON_CLOSE,
                 size = (300, 300))

  def onClick(event):
    print "clicked!"

  button = JButton("click me!", actionPerformed=onClick)
  frame.add(button)
  frame.visible = True

  while True:
    time.sleep(1000)
