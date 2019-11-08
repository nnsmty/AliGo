import csv,re,os


def write_csv(ID,list):
	filename = './static/download/'+ID+'.csv'
	type = os.path.exists(filename)
	if type == True:
		os.remove(filename)
	out = open(filename, 'a', newline='')
	csv_writer = csv.writer(out, dialect='excel')
	for i in list:
		csv_writer.writerow(i)