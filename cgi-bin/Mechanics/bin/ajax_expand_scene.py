#!/usr/bin/python
import sys
import json
import string


from mechanics.flexible_linker import *
from mechanics.association_dissociation_group import *
from mechanics.distribute_bodies import *
from mechanics.make_subunits import *
from mechanics.two_domain_construct import *



def rigid_structure(node,structure_nodes,force_nodes):
    structure_nodes[node['name']]=node
def force(node,structure_nodes,force_nodes):
    force_nodes.append(node)

def handle_default(node,structure_nodes,force_nodes):
    expanded_data['root'].append(node)

def strip_tag(node):
    node.pop('tag',None)
    return node

structure_nodes={}
force_nodes=[]

data=json.load(sys.stdin)

expanded_data={}
expanded_data['root']=[]
for key in data:
    if key!='root':
        expanded_data[key]=data[key]

handle_node={'MAKE_SUBUNITS': make_subunits,
	     	 'FLEXIBLE_LINKER': flexible_linker,
             'DISTRIBUTE_BODIES': distribute_bodies,
             'TWO_DOMAIN_CONSTRUCT': two_domain_construct,
             'ASSOCIATION_DISSOCIATION_CONSTRAINT': force,
             'ASSOCIATION_DISSOCIATION_GROUP': association_dissociation_group,
             'RIGID_STRUCTURE': rigid_structure,
             'RELATIVE_POSITION_CONSTRAINT': force,
             'ABSOLUTE_POSITION_CONSTRAINT': force}


for node in data['root']:
    handle_node.get(node['type'],handle_default)(node,structure_nodes,force_nodes)

expanded_data['root'].extend([strip_tag(obj) for obj in structure_nodes.values()])
expanded_data['root'].extend(force_nodes)

print 'Content-Type: application/json\n\n'
json.dump(expanded_data,sys.stdout,indent=4)
