# Rogue Game

This game is written using Typescript with React. The monsters, weapons and health potions were based off the those listed at [http://www.rots.net/rogue/monsters.html](http://www.rots.net/rogue/monsters.html). The map is created using a BSP algorithm as found here [https://eskerda.com/bsp-dungeon-generation/](https://eskerda.com/bsp-dungeon-generation/).

## User Stories/Requirements
* I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.

* All the items and enemies on the map are arranged at random.

* I can move throughout a map, discovering items.

* I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.

* Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.

* When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.

* When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.

* When I find and beat the boss, I win.

* The game should be challenging, but theoretically winnable.