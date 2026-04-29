using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class Department : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int? ParentDepartmentId { get; set; }

        [ForeignKey("ParentDepartmentId")]
        public virtual Department ParentDepartment { get; set; }

        [StringLength(100)]
        public string HeadOfDepartment { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Budget { get; set; }

        [StringLength(50)]
        public string CostCenter { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<Department> SubDepartments { get; set; } = new List<Department>();
        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public virtual ICollection<Designation> Designations { get; set; } = new List<Designation>();
    }

    public class Designation : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; }

        [StringLength(50)]
        public string Level { get; set; } // Junior, Senior, Manager, Director, etc.

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinSalary { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxSalary { get; set; }

        [StringLength(1000)]
        public string Responsibilities { get; set; }

        [StringLength(1000)]
        public string Requirements { get; set; }

        [StringLength(1000)]
        public string Skills { get; set; }

        public int? ReportsToDesignationId { get; set; }

        [ForeignKey("ReportsToDesignationId")]
        public virtual Designation ReportsToDesignation { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public virtual ICollection<Designation> SubordinateDesignations { get; set; } = new List<Designation>();
    }
}
