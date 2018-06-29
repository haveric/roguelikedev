from random import randint

from map_objects.rectangle import Rect
from map_objects.tile import Tile

class GameMap:
	def __init__(self, width, height):
		self.width = width
		self.height = height
		self.tiles = self.initialize_tiles()
		
	def initialize_tiles(self):
		tiles = [[Tile(True) for y in range(self.height)] for x in range(self.width)]
		
		return tiles
		
	def make_map(self, max_rooms, room_min_size, room_max_size, map_width, map_height, player):
		rooms = []
		num_rooms = 0
		
		for r in range(max_rooms):
			# Random width and height
			w = randint(room_min_size, room_max_size)
			h = randint(room_min_size, room_max_size)
			# Random position without going out of the map boundaries
			x = randint(0, map_width - w - 1)
			y = randint(0, map_height - h - 1)
			
			new_room = Rect(x, y, w, h)
			
			# run through the other rooms and see if the intersect with this one
			for other_room in rooms:
				if new_room.intersect(other_room):
					break
			else:
				# No intersections meaning valid room
				
				# "paint" it to the map's tiles
				self.create_room(new_room)
				
				# center coordinates of new room, will be useful later
				(new_x, new_y) = new_room.center()
				
				if num_rooms == 0:
					# this is the first room, where the player starts at
					player.x = new_x
					player.y = new_y
				else:
					# all rooms after the first:
					# connect it to the previous room with a tunnel
					
					# center coordinates of previous room
					(prev_x, prev_y) = rooms[num_rooms - 1].center()
					
					# flip a coin (Random number that is 0 or 1)
					if randint(0, 1) == 1:
						# first move horizontally, then vertically
						self.create_h_tunnel(prev_x, new_x, prev_y)
						self.create_v_tunnel(prev_y, new_y, new_x)
					else:
						# first move vertically, then horizontally
						self.create_v_tunnel(prev_y, new_y, prev_x)
						self.create_h_tunnel(prev_x, new_x, new_y)
						
				# finally, append the new room to the list
				rooms.append(new_room)
				num_rooms += 1
				
	def create_room(self, room):
		# Go through the tiles in the rectangle and make them passable
		for x in range(room.x1 + 1, room.x2):
			for y in range(room.y1 + 1, room.y2):
				self.tiles[x][y].blocked = False
				self.tiles[x][y].block_sight = False
	
	def create_h_tunnel(self, x1, x2, y):
		for x in range(min(x1, x2), max(x1, x2) + 1):
			self.tiles[x][y].blocked = False
			self.tiles[x][y].block_sight = False
			
	def create_v_tunnel(self, y1, y2, x):
		for y in range(min(y1, y2), max(y1, y2) + 1):
			self.tiles[x][y].blocked = False
			self.tiles[x][y].block_sight = False
	
	def is_blocked(self, x, y):
		if self.tiles[x][y].blocked:
			return True
		
		return False