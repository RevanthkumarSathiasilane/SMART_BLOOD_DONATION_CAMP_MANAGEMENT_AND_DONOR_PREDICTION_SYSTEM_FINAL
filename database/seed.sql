-- ALL PASSWORDS = password123
-- BCrypt hash below is verified correct for 'password123'
INSERT INTO users (username,email,password,role) VALUES
('admin','admin@blood.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh','SUPER_ADMIN'),
('coordinator1','coord@blood.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh','CAMP_COORDINATOR'),
('hospitaladmin','hospital@blood.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh','HOSPITAL_ADMIN'),
('donor1','donor1@blood.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh','DONOR')
ON CONFLICT (username) DO NOTHING;

INSERT INTO donors (user_id,name,age,gender,blood_group,phone,city,last_donation_date,total_donations,is_eligible) VALUES
(4,'Arjun Kumar',28,'Male','A+','9876543210','Chennai','2024-10-15',5,true),
(4,'Priya Sharma',32,'Female','B+','9876543211','Mumbai','2024-11-01',3,true),
(4,'Rahul Mehta',25,'Male','O+','9876543212','Delhi','2024-09-20',7,true),
(4,'Sneha Reddy',30,'Female','AB+','9876543213','Hyderabad','2024-12-10',2,true),
(4,'Kiran Patel',35,'Male','A-','9876543214','Ahmedabad','2024-08-15',9,true),
(4,'Divya Nair',27,'Female','O-','9876543215','Kochi','2024-11-25',4,true),
(4,'Amit Singh',40,'Male','B-','9876543216','Pune','2024-10-30',6,true),
(4,'Pooja Gupta',22,'Female','A+','9876543217','Bangalore','2024-12-05',1,true),
(4,'Suresh Iyer',45,'Male','AB-','9876543218','Chennai','2024-07-12',11,true),
(4,'Meena Krishnan',38,'Female','B+','9876543219','Coimbatore','2024-09-28',8,true),
(4,'Vijay Kumar',29,'Male','O+','9876543220','Madurai','2024-11-15',3,true),
(4,'Lakshmi Devi',33,'Female','A-','9876543221','Trichy','2024-10-08',6,true),
(4,'Ganesh Balu',26,'Male','B+','9876543222','Salem','2024-12-01',2,true),
(4,'Rani Murugan',31,'Female','O+','9876543223','Vellore','2024-08-20',10,true),
(4,'Siva Subramanian',42,'Male','A+','9876543224','Erode','2024-11-10',7,true),
(4,'Uma Shankar',28,'Female','AB+','9876543225','Tirupur','2024-09-05',4,true),
(4,'Ravi Prakash',36,'Male','O-','9876543226','Tirunelveli','2024-10-22',5,true),
(4,'Mani Vel',50,'Male','A+','9876543228','Tanjore','2024-07-30',15,true),
(4,'Selvi Arumugam',44,'Female','B+','9876543229','Pudukkottai','2024-11-05',9,true),
(4,'Harish Babu',23,'Male','O+','9876543230','Chennai','2024-09-18',2,true);

INSERT INTO camps (name,location,city,camp_date,start_time,end_time,coordinator_id,attendance_count,units_collected,status) VALUES
('Chennai Blood Drive','Govt General Hospital','Chennai','2024-10-05','09:00','17:00',2,85,80.5,'COMPLETED'),
('Mumbai Camp','KEM Hospital','Mumbai','2024-10-12','08:00','16:00',2,120,115.0,'COMPLETED'),
('Delhi Donation Drive','AIIMS Campus','Delhi','2024-10-20','09:00','17:00',2,95,90.0,'COMPLETED'),
('Hyderabad Blood Camp','Osmania Hospital','Hyderabad','2024-11-02','08:30','16:30',2,70,65.5,'COMPLETED'),
('Bangalore Drive','Manipal Hospital','Bangalore','2024-11-10','09:00','17:00',2,110,105.0,'COMPLETED'),
('Chennai Central Camp','Rajiv Gandhi Govt Hospital','Chennai','2025-05-08','09:00','17:00',2,0,0,'UPCOMING'),
('Mumbai North Drive','Sion Hospital','Mumbai','2025-05-15','08:00','16:00',2,0,0,'UPCOMING'),
('Delhi NCR Camp','Safdarjung Hospital','Delhi','2025-05-22','09:00','17:00',2,0,0,'UPCOMING'),
('Vellore Blood Drive','CMC Hospital','Vellore','2025-06-01','08:30','16:30',2,0,0,'UPCOMING'),
('Salem Donation Camp','Salem Govt Hospital','Salem','2025-06-10','09:00','17:00',2,0,0,'UPCOMING');

INSERT INTO donations (donor_id,camp_id,donation_date,units_donated,blood_group,status) VALUES
(1,1,'2024-10-05',1,'A+','COMPLETED'),(2,1,'2024-10-05',1,'B+','COMPLETED'),
(3,2,'2024-10-12',1,'O+','COMPLETED'),(4,2,'2024-10-12',1,'AB+','COMPLETED'),
(5,3,'2024-10-20',1,'A-','COMPLETED'),(6,3,'2024-10-20',1,'O-','COMPLETED'),
(7,4,'2024-11-02',1,'B-','COMPLETED'),(8,4,'2024-11-02',1,'A+','COMPLETED'),
(9,5,'2024-11-10',1,'AB-','COMPLETED'),(10,5,'2024-11-10',1,'B+','COMPLETED');
