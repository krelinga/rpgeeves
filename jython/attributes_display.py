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
